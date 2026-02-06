import { left, right } from '@sweet-monads/either';

import { BadRequestError } from '@/domain/errors/bad-request';
import { ServerError } from '@/domain/errors/server';
import { ProductModel } from '@/domain/models/db/product';
import { PurchaseOrderModel } from '@/domain/models/db/purchase-order';
import { ProductRepository, PurchaseOrderRepository } from '@/domain/repositories';
import { BulkCreatePurchaseOrdersUseCase } from '@/domain/use-cases/actions/bulk-create-purchase-orders';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';

export class BulkCreatePurchaseOrdersUseCaseImpl implements BulkCreatePurchaseOrdersUseCase {
    constructor(
        private readonly purchaseOrderRepository: PurchaseOrderRepository,
        private readonly productRepository: ProductRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: BulkCreatePurchaseOrdersUseCase.Params): Promise<BulkCreatePurchaseOrdersUseCase.Result> {
        try {
            if (!params || params.length === 0) {
                const message = this.translator.translate('noPurchaseOrdersProvided');
                return left(new BadRequestError(message));
            }

            const purchaseOrders = params.map((po) => PurchaseOrderModel.forCreate(po));

            const purchaseOrderValidation = this.validatePurchaseOrders(purchaseOrders);
            if (purchaseOrderValidation.hasError) {
                return left(new BadRequestError(purchaseOrderValidation.errorMessages.join('\n')));
            }

            const productValidation = await this.validateProducts(purchaseOrders);
            if (productValidation.hasError) {
                return left(new BadRequestError(productValidation.errorMessages.join('\n')));
            }

            await this.purchaseOrderRepository.bulkCreate(purchaseOrders);

            const message = this.translator.translate('purchaseOrdersCreatedSuccessfully');
            return right(message);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private validatePurchaseOrders(purchaseOrders: PurchaseOrderModel[]): ValidationResult {
        const errors: string[] = [];
        for (let i = 0; i < purchaseOrders.length; i++) {
            const purchaseOrder = purchaseOrders[i];
            const validation = purchaseOrder.validate();
            if (validation.hasError) {
                const translatedErrors = validation.errorMessages.map((error) => this.translator.translate(error));
                errors.push(`${this.translator.translate('purchaseOrder')} ${i + 1}: ${translatedErrors.join(', ')}`);
            }
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private async validateProducts(purchaseOrders: PurchaseOrderModel[]): Promise<ValidationResult> {
        const allProductIds = purchaseOrders.flatMap((po) => po.items.map((item) => item.product_id));
        const uniqueProductIds = [...new Set(allProductIds)];

        if (uniqueProductIds.length === 0) {
            return { hasError: false };
        }

        const products = await this.productRepository.findByIds(uniqueProductIds);
        if (!products) {
            const message = this.translator.translate('noProductsFound');
            return { hasError: true, errorMessages: [message] };
        }

        return this.validateProductsExistence(uniqueProductIds, products);
    }

    private validateProductsExistence(productIds: string[], products: ProductModel[]): ValidationResult {
        const existingProductIds = products.map((product) => product.id);
        const missingProductIds = productIds.filter((id) => !existingProductIds.includes(id));
        if (missingProductIds.length > 0) {
            const message = this.translator.translate({ text: 'specificProductsNotFound', args: missingProductIds.join(', ') });
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }
}
