import { left, right } from '@sweet-monads/either';

import { AfterReadProductsUseCase } from '@/domain/use-cases/entity-events/products';
import { ProductModel } from '@/domain/models/db/product';
import { ServerError } from '@/domain/errors/server';

export class AfterReadProductsUseCaseImpl implements AfterReadProductsUseCase {
    public execute(products: AfterReadProductsUseCase.Params): AfterReadProductsUseCase.Result {
        try {
            const formattedProducts = products.map((product) => {
                const productModel = ProductModel.basic({ id: product.id, name: product.name, price: product.price });
                return productModel.toFullObject();
            });
            return right(formattedProducts);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }
}
