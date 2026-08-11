import { randomUUID } from 'node:crypto';

import { left, right } from '@sweet-monads/either';

import { BadRequestError } from '@/domain/errors/bad-request';
import { NotFoundError } from '@/domain/errors/not-found';
import { ServerError } from '@/domain/errors/server';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { PetModel } from '@/domain/models/db/pet';
import { ProcedureModel } from '@/domain/models/db/procedure';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentRepository, PetRepository, ProcedureRepository, VeterinarianRepository } from '@/domain/repositories';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly procedureRepository: ProcedureRepository
    ) {}

    public async execute(params: ScheduleEmergencyAppointmentUseCase.Params): ScheduleEmergencyAppointmentUseCase.Result {
        try {
            const pet = await this.petRepository.findById(params.petId);
            if (!pet) return left(new NotFoundError('Pet not found'));

            const veterinarian = await this.veterinarianRepository.findById(params.veterinarianId);
            if (!veterinarian) return left(new NotFoundError('Veterinarian not found'));

            if (!params.procedure || params.procedure.length === 0) {
                return left(new BadRequestError('At least one procedure is required'));
            }

            const appointmentId = randomUUID();
            const procedures = this.createProcedures(params.procedure, appointmentId);
            const appointment = this.createAppointment(params, appointmentId, procedures);

            await this.appointmentRepository.create(appointment);
            await this.saveProcedures(procedures);

            return right(this.createResult(appointment, pet, veterinarian, procedures));
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }

    private createProcedures(procedures: ScheduleEmergencyAppointmentUseCase.EmergencyProcedureInput[], appointmentId: string): ProcedureModel[] {
        return procedures.map((procedure) =>
            ProcedureModel.with({
                id: randomUUID(),
                description: procedure.description,
                cost: procedure.cost,
                appointment_id: appointmentId
            })
        );
    }

    private createAppointment(params: ScheduleEmergencyAppointmentUseCase.Params, appointmentId: string, procedures: ProcedureModel[]): AppointmentModel {
        return AppointmentModel.with({
            id: appointmentId,
            date: new Date().toISOString(),
            status_id: 'IN_PROGRESS',
            isEmergency: true,
            totalCost: 0,
            notes: params.notes,
            pet_id: params.petId,
            veterinarian_id: params.veterinarianId,
            procedures: procedures.map((procedure) => procedure.toObject())
        });
    }

    private createResult(
        appointment: AppointmentModel,
        pet: PetModel,
        veterinarian: VeterinarianModel,
        procedures: ProcedureModel[]
    ): ScheduleEmergencyAppointmentUseCase.EmergencyAppointmentResult {
        return {
            id: appointment.id,
            date: appointment.date,
            status: appointment.statusId,
            isEmergency: appointment.isEmergency,
            totalCost: appointment.totalCost,
            notes: appointment.notes,
            pet: pet.toObject(),
            procedures: procedures.map((procedure) => procedure.toObject()),
            veterinarian: veterinarian.toObject()
        };
    }

    private async saveProcedures(procedures: ProcedureModel[]): Promise<void> {
        for (const procedure of procedures) {
            await this.procedureRepository.create(procedure);
        }
    }
}
