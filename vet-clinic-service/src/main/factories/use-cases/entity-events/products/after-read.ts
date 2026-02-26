import { AfterReadProductsUseCaseImpl } from '@/data/use-cases/entity-events/pets/after-read';

export const makeAfterReadProductsUseCase = () => {
    return new AfterReadProductsUseCaseImpl();
};

export const afterReadProductsUseCase = makeAfterReadProductsUseCase();
