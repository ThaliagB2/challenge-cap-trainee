import { makeAfterReadPetsUseCase } from '@/main/factories/use-cases/entity-events/pets/after-read';
import { AfterReadPetsController } from '@/presentation/entity-events/pets/after-read';

export const makeAfterReadPetsController = () => {
    const useCase = makeAfterReadPetsUseCase();

    return new AfterReadPetsController(useCase);
};

export const afterReadPetsController = makeAfterReadPetsController();
