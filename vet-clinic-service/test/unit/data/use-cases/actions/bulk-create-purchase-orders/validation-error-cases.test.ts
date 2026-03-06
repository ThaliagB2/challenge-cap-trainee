import { BadRequestError } from '@/domain/errors';
import { BulkCreatePurchaseOrdersUseCase } from '@/domain/use-cases/actions/bulk-create-purchase-orders';
import { describe, expect, it } from 'vitest';
import { makeSut } from './shared-helpers';

describe('BulkCreatePurchaseOrdersUseCase - Validation Error Cases', () => {
    it('should return error when payload is empty', async () => {
        const { sut } = makeSut();
        const result = await sut.execute([]);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toBe('No purchase orders provided');
    });

    it('should return error when payload is null/undefined', async () => {
        const { sut } = makeSut();
        const result = await sut.execute(null as BulkCreatePurchaseOrdersUseCase.Params);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toBe('No purchase orders provided');
    });

    it('should return error when date is missing', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                total: 30,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            } as BulkCreatePurchaseOrdersUseCase.Params[0]
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Date is required');
    });

    it('should return error when date is empty', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '',
                total: 30,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Date is required');
    });

    it('should return error when date is too long', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01T10:30:00',
                total: 30,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Date must not exceed 10 characters');
    });

    it('should return error when items are missing', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 0,
                items: undefined
            } as unknown as BulkCreatePurchaseOrdersUseCase.Params[0]
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Items are required');
    });

    it('should return error when items array is empty', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 0,
                items: [] as BulkCreatePurchaseOrdersUseCase.Params[0]['items']
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Items are required');
    });

    it('should return error when product_id is missing', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 30,
                items: [{ id: '', quantity: 2, price: 15, purchaseOrder_id: '', product_id: undefined } as unknown as BulkCreatePurchaseOrdersUseCase.Params[0]['items'][0]]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Product ID is required');
    });

    it('should return error when product_id is empty', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 30,
                items: [{ id: '', product_id: '', quantity: 2, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Product ID is required');
    });

    it('should return error when quantity is zero', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 0,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 0, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Quantity is required');
    });

    it('should return error when quantity is negative', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: -75,
                items: [{ id: '', product_id: 'valid-product-id', quantity: -5, price: 15, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Quantity is required');
    });

    it('should return error when price is zero', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: 0,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 0, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Price is required');
    });

    it('should return error when price is negative', async () => {
        const { sut } = makeSut();
        const payload = [
            {
                date: '2025-01-01',
                total: -20,
                items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: -10, purchaseOrder_id: '' }]
            }
        ];
        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Purchase order 1: Price is required');
    });

    it('should return error with multiple validation issues', async () => {
        const { sut } = makeSut();
        const payload = [
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
        expect(error.message).toContain('Purchase order 1:');
        expect(error.message).toContain('Date is required');
        expect(error.message).toContain('Product ID is required');
        expect(error.message).toContain('Quantity is required');
        expect(error.message).toContain('Price is required');
    });
});
