import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';
import { PetModel } from '@/domain/models/db/pet';
import { Translator } from '@/domain/utils/translator';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { PetRepository, VeterinarianRepository } from '@/domain/repositories';

export class BeforeCreateAppointmentUseCaseImpl implements BeforeCreateAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    public async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        const createAppointment = AppointmentModel.create(params);
        const validateAppointment = createAppointment.validateData();

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

        if (!params.status) {
            params.status = 'SCHEDULED';
        }

        params.totalCost = createAppointment.calculateTotalCost();

        return right(createAppointment.toObject());
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
