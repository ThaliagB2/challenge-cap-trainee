import { AfterReadPetsController } from '@/presentation/entity-events/pets';
import { afterReadPetsUseCase } from '@/main/factories/use-cases/entity-events/pets/after-read';

export const makeAfterReadPetsController = () => {
    return new AfterReadPetsController(afterReadPetsUseCase);
};

export const afterReadPetsController = makeAfterReadPetsController();
