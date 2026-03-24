import { makeAfterReadPetsUseCase } from '@/main/factories/use-cases/entity-events/pets';
import { AfterReadPetsController } from '@/presentation/entity-events/pets';

export const makeAfterReadPetController = () => {
    const useCase = makeAfterReadPetsUseCase();
    return new AfterReadPetsController(useCase);
};

export const afterReadPetController = makeAfterReadPetController();
