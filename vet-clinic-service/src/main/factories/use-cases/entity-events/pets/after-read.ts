import { AfterReadPetsUseCaseImpl } from '@/data/use-cases/entity-events/pets/after-read';

export const makeAfterReadPetsUseCase = () => {
    return new AfterReadPetsUseCaseImpl();
};
