import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';
import { AppointmentRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly translator: Translator,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly petRepository: PetRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {
        this.translator = translator;
        this.veterinarianRepository = veterinarianRepository;
        this.petRepository = petRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const appointmentModel = AppointmentModel.createEmergencyAppointment(params);
            const fieldsValidation = appointmentModel.validateFields(params);
            if (fieldsValidation.hasError) {
                return left(new BadRequestError(fieldsValidation.errorMessages.join('\n')));
            }

            const validatePet = await this.validatePet(params.pet_id);
            if (validatePet.hasError) {
                return left(new NotFoundError(validatePet.errorMessages.join('\n')));
            }

            const validateVet = await this.validateVeterinarian(params.veterinarian_id);
            if (validateVet.hasError) {
                return left(new NotFoundError(validateVet.errorMessages.join('\n')));
            }

            const validatedProcedures = appointmentModel.validateProcedures(params.procedures);
            if (validatedProcedures.hasError) {
                return left(new BadRequestError(validatedProcedures.errorMessages.join('\n')));
            }

            await this.appointmentRepository.bulkCreate({ appointments: [appointmentModel] });
            return right(appointmentModel.toFullObject());
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async validatePet(petId: string): Promise<ValidationResult> {
        const errors = [];
        const pet = await this.petRepository.findById({ id: petId });
        if (!pet) {
            errors.push(this.translator.translate('noPetFound'));
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private async validateVeterinarian(vetId: string): Promise<ValidationResult> {
        const errors = [];
        const vet = await this.veterinarianRepository.findById({ id: vetId });
        if (!vet) {
            errors.push(this.translator.translate('noVeterinarianFound'));
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }
}
