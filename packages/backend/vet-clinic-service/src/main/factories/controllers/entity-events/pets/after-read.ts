import { afterReadPetsUseCase } from '@/main/factories/use-cases/entity-events/pets/after-read';
import { translator } from '@/main/factories/utils/translator';
import { AfterReadPetsController } from '@/presentation/entity-events/pets';

const makeAfterReadPetsController = (): AfterReadPetsController => {
    return new AfterReadPetsController(afterReadPetsUseCase, translator);
};

export const afterReadPetsController = makeAfterReadPetsController();
