import { AfterReadProductsController } from '@/presentation/entity-events/products';
import { afterReadProductsUseCase } from '@/main/factories/use-cases/entity-events/products';

const makeAfterReadProductsController = (): AfterReadProductsController => {
    return new AfterReadProductsController(afterReadProductsUseCase);
};

export const afterReadProductsController = makeAfterReadProductsController();
