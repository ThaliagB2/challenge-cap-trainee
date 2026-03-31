import { BadRequestError } from '@/domain/errors';
import { ProductRepositoryStub } from './stubs';
import { makeSut } from './shared-helpers';
import { describe, expect, it } from 'vitest';

describe('BulkCreatePurchaseOrdersUseCase - Business Logic Error Cases', () => {
    it('should return error when product does not exist', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 30,
                items: [{ id: '', product_id: 'non-existent-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toBe('Products not found: non-existent-id');
    });

    it('should return error when multiple products do not exist', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 50,
                items: [
                    { id: '', product_id: 'non-existent-1', quantity: 2, price: 15, purchaseOrder_id: '' },
                    { id: '', product_id: 'non-existent-2', quantity: 3, price: 20, purchaseOrder_id: '' }
                ]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Products not found:');
        expect(error.message).toContain('non-existent-1');
        expect(error.message).toContain('non-existent-2');
    });

    it('should return error when mixing valid and invalid products', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 50,
                items: [
                    { id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' },
                    { id: '', product_id: 'non-existent-id', quantity: 3, price: 20, purchaseOrder_id: '' }
                ]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toBe('Products not found: non-existent-id');
    });

    it('should return error when product repository returns null', async () => {
        const productRepository = new ProductRepositoryStub([]);
        const { sut } = makeSut({ productRepository });

        // Override findByIds to return null
        productRepository.findByIds = async () => null as unknown as never[];

        const payload = [
            {
                date: '2025-01-01',
                total: 30,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toBe('No products found');
    });
});
