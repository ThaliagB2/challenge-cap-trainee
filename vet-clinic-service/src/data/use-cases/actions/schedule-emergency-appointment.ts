import { randomUUID } from 'node:crypto';

import { left, right } from '@sweet-monads/either';

import { BadRequestError } from '@/domain/errors/bad-request';
import { NotFoundError } from '@/domain/errors/not-found';
import { ServerError } from '@/domain/errors/server';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { ProcedureModel } from '@/domain/models/db/procedure';
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
            const pet = await this.validatePet(params.petId);
            const veterinarian = await this.validateVeterinarian(params.veterinarianId);
            this.validateProcedures(params.procedure);

            const appointmentId = randomUUID();
            const procedures = this.createProcedures({ procedures: params.procedure, appointmentId });
            const appointment = this.createAppointment({ params, appointmentId, procedures });

            await this.appointmentRepository.create(appointment);
            await this.saveProcedures(procedures);

            return right(this.createResult({ appointment, pet, veterinarian, procedures }));
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof BadRequestError) {
                return left(error);
            }

            const errorData = error as Error;
            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }

    private async validatePet(petId: ScheduleEmergencyAppointmentUseCase.ValidatePetParams): ScheduleEmergencyAppointmentUseCase.ValidatePetResult {
        const pet = await this.petRepository.findById(petId);

        if (!pet) {
            throw new NotFoundError('Pet not found');
        }

        return pet;
    }

    private async validateVeterinarian(
        veterinarianId: ScheduleEmergencyAppointmentUseCase.ValidateVeterinarianParams
    ): ScheduleEmergencyAppointmentUseCase.ValidateVeterinarianResult {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);

        if (!veterinarian) {
            throw new NotFoundError('Veterinarian not found');
        }

        return veterinarian;
    }

    private validateProcedures(procedures: ScheduleEmergencyAppointmentUseCase.ValidateProceduresParams): ScheduleEmergencyAppointmentUseCase.ValidateProceduresResult {
        if (!procedures || procedures.length === 0) {
            throw new BadRequestError('At least one procedure is required');
        }
    }

    private createProcedures(params: ScheduleEmergencyAppointmentUseCase.CreateProceduresParams): ScheduleEmergencyAppointmentUseCase.CreateProceduresResult {
        return params.procedures.map((procedure) =>
            ProcedureModel.with({
                id: randomUUID(),
                description: procedure.description,
                cost: procedure.cost,
                appointment_id: params.appointmentId
            })
        );
    }

    private createAppointment(params: ScheduleEmergencyAppointmentUseCase.CreateAppointmentParams): ScheduleEmergencyAppointmentUseCase.CreateAppointmentResult {
        return AppointmentModel.with({
            id: params.appointmentId,
            date: new Date().toISOString(),
            status_id: 'IN_PROGRESS',
            isEmergency: true,
            totalCost: 0,
            notes: params.params.notes,
            pet_id: params.params.petId,
            veterinarian_id: params.params.veterinarianId,
            procedures: params.procedures.map((procedure) => procedure.toObject())
        });
    }

    private createResult(params: ScheduleEmergencyAppointmentUseCase.CreateResultParams): ScheduleEmergencyAppointmentUseCase.CreateResultResult {
        return {
            id: params.appointment.id,
            date: params.appointment.date,
            status: params.appointment.statusId,
            isEmergency: params.appointment.isEmergency,
            totalCost: params.appointment.totalCost,
            notes: params.appointment.notes,
            pet: params.pet.toObject(),
            procedures: params.procedures.map((procedure) => procedure.toObject()),
            veterinarian: params.veterinarian.toObject()
        };
    }

    private async saveProcedures(procedures: ScheduleEmergencyAppointmentUseCase.SaveProceduresParams): ScheduleEmergencyAppointmentUseCase.SaveProceduresResult {
        for (const procedure of procedures) {
            await this.procedureRepository.create(procedure);
        }
    }
}
