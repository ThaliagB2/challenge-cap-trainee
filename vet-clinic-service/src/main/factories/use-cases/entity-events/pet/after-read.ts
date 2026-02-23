import { AfterReadPetUseCaseImpl } from '@/data/use-cases/entity-events/pet/after-read';

export const makeAfterReadPetUseCase = () => {
    return new AfterReadPetUseCaseImpl();
};

export const afterReadPetUseCase = makeAfterReadPetUseCase();
