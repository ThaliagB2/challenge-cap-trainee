import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { PayloadResult, ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { Translator } from '@/domain/utils/translator';
import { AppointmentRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {}

    async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const petExists = await this.validatePetExists(params.pet_id);
            if (petExists.hasError) {
                return left(new NotFoundError(petExists.errorMessage));
            }

            const veterinarianExists = await this.validateVeterinarianExists(params.veterinarian_id);
            if (veterinarianExists.hasError) {
                return left(new NotFoundError(veterinarianExists.errorMessage));
            }

            if (params.procedures.length === 0) {
                return left(new BadRequestError('No procedures provided'));
            }

            const appointment = AppointmentModel.createEmergencyAppointment(params);
            await this.appointmentRepository.create(appointment);
            return right({
                hasError: false,
                appointmentId: appointment.id
            });
        } catch {
            return left(new ServerError('Internal server error'));
        }
    }

    private async validatePetExists(petId: string): Promise<PayloadResult> {
        const pet = await this.petRepository.findById(petId);

        if (!pet) {
            return {
                hasError: true,
                errorMessage: 'Pet not found'
            };
        }

        return {
            pet,
            hasError: false
        };
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
