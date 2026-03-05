import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { PetModel } from '@/domain/models/db/pet';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { Translator } from '@/domain/utils/translator';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const appointment = AppointmentModel.createEmergencyAppointment(params);
            const validateAppointment = appointment.validateData();

            if (validateAppointment.hasError) {
                const errorMessages = validateAppointment.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n ');
                return left(new BadRequestError(errorMessages));
            }

            const petExists = await this.validatePetExists(params.pet_id);
            if (!petExists) {
                const message = this.translator.translate('petNotFound');
                return left(new NotFoundError(message));
            }

            const veterinarianExists = await this.validateVeterinarianExists(params.veterinarian_id);
            if (!veterinarianExists) {
                const message = this.translator.translate('veterinarianNotFound');
                return left(new NotFoundError(message));
            }

            if (params.procedures.length === 0) {
                const message = this.translator.translate('noProceduresProvided');
                return left(new BadRequestError(message));
            }

            await this.appointmentRepository.create(appointment);
            return right(appointment.id);
        } catch {
            const message = this.translator.translate('internalServerError');
            return left(new ServerError(message));
        }
    }

    private async validatePetExists(petId: string): Promise<PetModel> {
        const pet = await this.petRepository.findById(petId);
        return pet;
    }

    private async validateVeterinarianExists(veterinarianId: string): Promise<VeterinarianModel> {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);
        return veterinarian;
    }
}
