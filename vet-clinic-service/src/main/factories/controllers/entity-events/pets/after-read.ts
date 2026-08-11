import { afterReadPetsUseCase } from '@/main/factories/use-cases/entity-events/pets/after-read';
import { AfterReadPetsController } from '@/presentation/entity-events/pets';

const makeAfterReadPetsController = (): AfterReadPetsController => {
    return new AfterReadPetsController(afterReadPetsUseCase);
};

export const afterReadPetsController = makeAfterReadPetsController();
