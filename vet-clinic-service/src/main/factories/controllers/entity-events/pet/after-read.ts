import { AfterReadPetController } from '@/presentation/entity-events/pet';
import { makeAfterReadPetUseCase } from '@/main/factories/use-cases/entity-events/pet';

export const makeAfterReadPetController = () => {
    const useCase = makeAfterReadPetUseCase();
    return new AfterReadPetController(useCase);
};

export const afterReadPetController = makeAfterReadPetController();
