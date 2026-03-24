import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError } from '@/domain/errors';
import { PetsModel } from '@/domain/models/db/pets';
import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { PetsRepository, VeterinariansRepository } from '@/domain/repositories';
import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';

export class BeforeCreateAppointmentsUseCaseImpl implements BeforeCreateAppointmentUseCase {
    constructor(
        private readonly petRepository: PetsRepository,
        private readonly vetRepository: VeterinariansRepository
    ) {
        this.petRepository = petRepository;
        this.vetRepository = vetRepository;
    }

    public async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        const petExist = await this.validatePet(params.pet_id);
        if (!petExist) {
            return left(new NotFoundError('Pet não Encontrado'));
        }

        const vetExist = await this.validateVet(params.veterinarian_id);
        if (!vetExist) {
            return left(new NotFoundError('Veterinario não encontrado'));
        }

        if (params.procedures.length === 0) {
            return left(new BadRequestError('Nenhum procedimento foi encontrado'));
        }

        if (!params.status) {
            params.status = 'SCHEDULED';
        }

        const calculateTotalCost = params.procedures.reduce((total, procedure) => total + procedure.cost, 0);
        params.totalCost = calculateTotalCost;

        return right(params);
    }

    private async validatePet(PetId: string): Promise<PetsModel> {
        const pet = await this.petRepository.findPetsById(PetId);
        return pet;
    }

    private async validateVet(veterinarianId: string): Promise<VeterinariansModel> {
        const vet = await this.vetRepository.findVeterinarianById(veterinarianId);
        return vet;
    }
}
