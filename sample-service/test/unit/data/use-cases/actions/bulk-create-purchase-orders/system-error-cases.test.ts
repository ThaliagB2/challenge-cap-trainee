import { BulkCreatePurchaseOrdersUseCaseImpl } from '@/data/use-cases/actions/bulk-create-purchase-orders';
import { ServerError } from '@/domain/errors';
import { describe, expect, it } from 'vitest';
import { makeValidPayload } from './shared-helpers';
import { ProductRepositoryStub, PurchaseOrderRepositoryStub, TranslatorStub } from './stubs';

describe('BulkCreatePurchaseOrdersUseCase - System Error Cases', () => {
    it('should return ServerError when product repository throws an error', async () => {
        const productRepository = new ProductRepositoryStub([]);
        productRepository.setError(new Error('Database connection failed'));
        const purchaseOrderRepository = new PurchaseOrderRepositoryStub();
        const translator = new TranslatorStub();
        const sut = new BulkCreatePurchaseOrdersUseCaseImpl(purchaseOrderRepository, productRepository, translator);

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Database connection failed');
    });

    it('should return ServerError when purchase order repository throws an error', async () => {
        const productRepository = new ProductRepositoryStub([{ id: 'valid-product-id', name: 'Product 1', price: 10 }]);
        const purchaseOrderRepository = new PurchaseOrderRepositoryStub();
        purchaseOrderRepository.setError(new Error('Failed to create purchase orders'));
        const translator = new TranslatorStub();
        const sut = new BulkCreatePurchaseOrdersUseCaseImpl(purchaseOrderRepository, productRepository, translator);

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Failed to create purchase orders');
    });

    it('should return ServerError when an unexpected error occurs', async () => {
        // Force an error by making translator throw
        const productRepository = new ProductRepositoryStub([{ id: 'valid-product-id', name: 'Product 1', price: 10 }]);
        const purchaseOrderRepository = new PurchaseOrderRepositoryStub();
        const translator = new TranslatorStub();
        translator.translate = () => {
            throw new Error('Unexpected error');
        };

        const sut = new BulkCreatePurchaseOrdersUseCaseImpl(purchaseOrderRepository, productRepository, translator);

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Unexpected error');
    });
});
