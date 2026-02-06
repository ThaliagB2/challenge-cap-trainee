import { left, right } from '@sweet-monads/either';

import { BadRequestError } from '@/domain/errors/bad-request';
import { ServerError } from '@/domain/errors/server';
import { ProductModel } from '@/domain/models/db/product';
import { PurchaseOrderModel } from '@/domain/models/db/purchase-order';
import { ProductRepository } from '@/domain/repositories';
import { BeforeCreatePurchaseOrderUseCase } from '@/domain/use-cases/entity-events/purchase-order';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';

export class BeforeCreatePurchaseOrderUseCaseImpl implements BeforeCreatePurchaseOrderUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly translator: Translator
    ) {
        this.productRepository = productRepository;
        this.translator = translator;
    }

    public async execute(params: BeforeCreatePurchaseOrderUseCase.Params): Promise<BeforeCreatePurchaseOrderUseCase.Result> {
        try {
            const purchaseOrder = PurchaseOrderModel.forCreate(params);
            const validatedPurchaseOrder = purchaseOrder.validate();
            if (validatedPurchaseOrder.hasError) {
                const errorMessages = validatedPurchaseOrder.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n');
                return left(new BadRequestError(errorMessages));
            }
            const poItemProducts = purchaseOrder.items.map((item) => item.product_id);
            const products = await this.getProducts(poItemProducts);
            if (!products) {
                const message = this.translator.translate('noProductsFound');
                return left(new BadRequestError(message));
            }
            const validatedProducts = this.validateProducts(poItemProducts, products);
            if (validatedProducts.hasError) {
                return left(new BadRequestError(validatedProducts.errorMessages.join('\n')));
            }
            return right(purchaseOrder.toCreationObject());
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getProducts(productsIds: string[]): Promise<ProductModel[]> {
        const products = await this.productRepository.findByIds(productsIds);
        return products;
    }

    private validateProducts(poItemProducts: string[], products: ProductModel[]): ValidationResult {
        const productsIds = products.map((product) => product.id);

        const productsNotFound = poItemProducts.filter((productId) => !productsIds.includes(productId));
        if (productsNotFound.length > 0) {
            const productsNotFoundIds = productsNotFound.join(', ');
            const message = this.translator.translate({ text: 'specificProductsNotFound', args: productsNotFoundIds });
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }
}
