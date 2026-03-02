import { left, right } from '@sweet-monads/either';

import { GetVeterinarianScheduleUseCase, PayloadResult } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { NotFoundError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';
import { AppointmentRepository, VeterinarianRepository, PetRepository, OwnerRepository, ProcedureRepository } from '@/domain/repositories';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly petRepository: PetRepository,
        private readonly ownerRepository: OwnerRepository,
        private readonly procedureRepository: ProcedureRepository
    ) {}

    // eslint-disable-next-line max-lines-per-function
    async execute(veterinarianId: string, days: number): Promise<GetVeterinarianScheduleUseCase.Result> {
        const veterinarianExists = await this.validateVeterinarianExists(veterinarianId);

        if (veterinarianExists.hasError) {
            return left(new NotFoundError(veterinarianExists.errorMessage));
        }

        const today = new Date();
        const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
        const appointments = await this.appointmentRepository.findByVetIdAndDate(veterinarianId, today, futureDate);

        if (appointments.length === 0) {
            return left(new NotFoundError('No appointments found'));
        }

        const schedulings = await Promise.all(
            appointments.map(async (appointment) => {
                const pet = await this.petRepository.findById(appointment.pet_id);
                if (!pet) {
                    throw new Error(`Pet with id ${appointment.pet_id} not found`);
                }
                const owner = await this.ownerRepository.findById(pet.owner_id);
                if (!pet) {
                    throw new Error(`Pet with id ${appointment.pet_id} not found`);
                }
                const procedures = await this.procedureRepository.findByAppointmentId(appointment.id);

                return VeterinarianScheduleModel.create({
                    id: appointment.id,
                    date: appointment.date,
                    status: appointment.status,
                    isEmergency: appointment.isEmergency,
                    totalCost: appointment.totalCost,
                    notes: appointment.notes,
                    veterinarian_id: appointment.veterinarian_id,
                    procedures: procedures.map((proc) => proc.toObject()),
                    pet: pet.toObject(),
                    owner: owner.toObject()
                });
            })
        );

        return right({
            hasError: false,
            schedulings
        });
    }

    private async validateVeterinarianExists(veterinarianId: string): Promise<PayloadResult> {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);

        if (!veterinarian) {
            return {
                hasError: true,
                errorMessage: 'Veterinarian not found'
            };
        }

        return {
            veterinarian,
            hasError: false
        };
    }
}
