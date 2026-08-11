import { AfterReadPetsUseCaseImpl } from '@/data/use-cases/entity-events/pets/after-read';

export const makeAfterReadPetsUseCase = (): AfterReadPetsUseCaseImpl => {
    return new AfterReadPetsUseCaseImpl();
};

export const afterReadPetsUseCase = makeAfterReadPetsUseCase();
