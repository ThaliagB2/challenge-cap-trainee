import { left, right } from '@sweet-monads/either';

/* eslint-disable max-lines-per-function */
import { BadRequestError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { ProcedureProps } from '@/domain/models/db/procedure';
import { AppointmentRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';

export class BeforeCreateAppointmentUseCaseImpl implements BeforeCreateAppointmentUseCase {
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

    public async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        try {
            const pet = await this.petRepository.findById({ id: params.pet_id });
            if (!pet) {
                const message = this.translator.translate('noPetFound');
                return left(new BadRequestError(message));
            }

            const veterinarian = await this.veterinarianRepository.findById({ id: params.veterinarian_id });
            if (!veterinarian) {
                const message = this.translator.translate('noVeterinarianFound');
                return left(new BadRequestError(message));
            }

            const validatedProcedures = this.validateProcedures(params.procedures);
            if (validatedProcedures.hasError) {
                return left(new BadRequestError(validatedProcedures.errorMessages.join('\n')));
            }

            const appointment = AppointmentModel.create({
                pet_id: pet.id,
                veterinarian_id: veterinarian.id,
                ...params
            });

            await this.appointmentRepository.bulkCreate({ appointments: [appointment] });
            return right(appointment.toCreationObject());
        } catch (error) {
            const errorData = error as Error;
            return left(new BadRequestError(errorData.stack, errorData.message));
        }
    }

    private validateProcedures(procedures: ProcedureProps[]): ValidationResult {
        if (!procedures || procedures.length === 0) {
            return { hasError: true, errorMessages: ['proceduresAreRequired'] };
        }

        const errors = [];
        for (const proc of procedures) {
            if (!proc.id || proc.id.trim() === '') {
                errors.push('procedureIdIsRequired');
            }
            if (!proc.description || proc.description.trim() === '') {
                errors.push('procedureDescriptionIsRequired');
            }
            if (!proc.cost || proc.cost <= 0) {
                errors.push('validProcedureCostIsRequired');
            }
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }
}
