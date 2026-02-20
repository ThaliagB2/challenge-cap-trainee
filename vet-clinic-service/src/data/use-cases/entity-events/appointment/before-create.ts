import { left, right } from '@sweet-monads/either';

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
    ) {
        this.petRepository = petRepository;
        this.veterinarianRepository = veterinarianRepository;
        this.translator = translator;
    }

    async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        const petExists = await this.validatePetExists(params.pet_id);
        if (!petExists) {
            return left(new NotFoundError('Pet not found'));
        }

        const veterinarianExists = await this.validateVeterinarianExists(params.veterinarian_id);
        if (!veterinarianExists) {
            return left(new NotFoundError('Veterinarian not found'));
        }

        if (params.procedures.length === 0) {
            return left(new BadRequestError('No procedures provided'));
        }

        const totalCost = params.procedures.reduce((total, procedure) => total + procedure.cost, 0);
        params.totalCost = totalCost;

        if (!params.status) {
            params.status = 'SCHEDULED';
        }

        return right(params);
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
