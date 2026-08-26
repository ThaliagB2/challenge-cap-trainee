import { describe, expect, it } from 'vitest';
import { makeMultipleValidPayload, makeSut, makeValidPayload } from './shared-helpers';

describe('BulkCreatePurchaseOrdersUseCase - Success Cases', () => {
    it('should return success message when purchase orders are created successfully', async () => {
        const { sut } = makeSut();
        const result = await sut.execute(makeValidPayload());

        expect(result.isRight()).toBeTruthy();
        expect(result.value).toBe('Purchase orders created successfully');
    });

    it('should create multiple purchase orders successfully', async () => {
        const { sut } = makeSut();
        const result = await sut.execute(makeMultipleValidPayload());

        expect(result.isRight()).toBeTruthy();
        expect(result.value).toBe('Purchase orders created successfully');
    });
});
