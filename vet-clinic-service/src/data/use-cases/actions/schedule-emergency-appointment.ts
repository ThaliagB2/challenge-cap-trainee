/* eslint-disable max-lines-per-function */
import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { ProcedureProps } from '@/domain/models/db/procedure';
import { AppointmentRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';

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
            const fieldsValidation = this.validateFields(params);
            if (fieldsValidation.hasError) {
                return left(new BadRequestError(fieldsValidation.errorMessages.join('\n')));
            }

            const pet = await this.petRepository.findById({ id: params.pet_id });
            if (!pet?.id) {
                const message = this.translator.translate('noPetFound');
                return left(new NotFoundError(message));
            }

            const veterinarian = await this.veterinarianRepository.findById({ id: params.veterinarian_id });
            if (!veterinarian?.id) {
                const message = this.translator.translate('noVeterinarianFound');
                return left(new NotFoundError(message));
            }

            const validatedProcedures = this.validateProcedures(params.procedures);
            if (validatedProcedures.hasError) {
                return left(new BadRequestError(validatedProcedures.errorMessages.join('\n')));
            }
            const appointment = AppointmentModel.createEmergencyAppointment(params);
            await this.appointmentRepository.bulkCreate({ appointments: [appointment] });

            const message = this.translator.translate('ScheduleEmergencyAppointmentSuccessfully');
            return right(message);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private validateProcedures(procedures: ProcedureProps[]): ValidationResult {
        if (!procedures || procedures.length === 0) {
            return { hasError: true, errorMessages: ['proceduresAreRequired'] };
        }

        const errors = [];
        for (const proc of procedures) {
            if (!proc.description || proc.description.trim() === '') {
                errors.push('procedureDescriptionIsRequired');
            }
            if (!proc.cost || proc.cost <= 0) {
                errors.push('validProcedureCostIsRequired');
            }
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validateFields(params: ScheduleEmergencyAppointmentUseCase.Params): ValidationResult {
        const errors = [];
        if (!params.notes) {
            errors.push('notesAreRequired');
        }
        if (!params.pet_id) {
            errors.push('petIdIsRequired');
        }
        if (!params.veterinarian_id) {
            errors.push('vetIdIsRequired');
        }
        if (!params.procedures || params.procedures.length === 0) {
            errors.push('proceduresAreRequired');
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }
}
