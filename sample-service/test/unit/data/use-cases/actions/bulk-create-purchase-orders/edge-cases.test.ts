import { BadRequestError } from '@/domain/errors';
import { BulkCreatePurchaseOrdersUseCase } from '@/domain/use-cases/actions/bulk-create-purchase-orders';
import { describe, expect, it } from 'vitest';
import { makeSut } from './shared-helpers';

describe('BulkCreatePurchaseOrdersUseCase - Edge Cases', () => {
    it('should handle mixed valid and invalid purchase orders', async () => {
        const { sut } = makeSut();
        const payload: BulkCreatePurchaseOrdersUseCase.Params = [
            {
                date: '2025-01-01',
                total: 30,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            },
            {
                date: '',
                total: 0,
                items: [{ id: '', product_id: '', quantity: 0, price: 0, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 2:');
    });

    it('should handle duplicate product IDs in same purchase order', async () => {
        const { sut } = makeSut();
        const payload: BulkCreatePurchaseOrdersUseCase.Params = [
            {
                date: '2025-01-01',
                total: 50,
                items: [
                    { id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' },
                    { id: '', product_id: 'valid-product-id', quantity: 3, price: 20, purchaseOrder_id: '' }
                ]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isRight()).toBeTruthy();
        expect(result.value).toBe('Purchase orders created successfully');
    });

    it('should handle same product across different purchase orders', async () => {
        const { sut } = makeSut();
        const payload: BulkCreatePurchaseOrdersUseCase.Params = [
            {
                date: '2025-01-01',
                total: 30,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            },
            {
                date: '2025-01-02',
                total: 60,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 3, price: 20, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isRight()).toBeTruthy();
        expect(result.value).toBe('Purchase orders created successfully');
    });
});
