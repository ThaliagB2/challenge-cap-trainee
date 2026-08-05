import { AfterReadProductsUseCaseImpl } from '@/data/use-cases/entity-events/products/after-read';

export const makeAfterReadProductsUseCase = () => {
    return new AfterReadProductsUseCaseImpl();
};

export const afterReadProductsUseCase = makeAfterReadProductsUseCase();
