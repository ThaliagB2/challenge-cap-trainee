import { BulkCreatePurchaseOrdersUseCaseImpl } from '@/data/use-cases/actions/bulk-create-purchase-orders';
import { ProductRepository, PurchaseOrderRepository } from '@/domain/repositories';
import { BulkCreatePurchaseOrdersUseCase } from '@/domain/use-cases/actions/bulk-create-purchase-orders';
import { Translator } from '@/domain/utils/translator';
import { ProductRepositoryStub, PurchaseOrderRepositoryStub, TranslatorStub } from './stubs';

export type SutTypes = {
    productRepository: ProductRepository;
    purchaseOrderRepository: PurchaseOrderRepository;
    translator: Translator;
    sut: BulkCreatePurchaseOrdersUseCase;
};

export const makeSut = (overrides: Partial<Omit<SutTypes, 'sut'>> = {}): SutTypes => {
    const productRepository =
        overrides.productRepository ??
        new ProductRepositoryStub([
            { id: 'valid-product-id', name: 'Product 1', price: 10 },
            { id: 'another-valid-id', name: 'Product 2', price: 20 }
        ]);
    const purchaseOrderRepository = overrides.purchaseOrderRepository ?? new PurchaseOrderRepositoryStub();
    const translator = overrides.translator ?? new TranslatorStub();
    const sut = new BulkCreatePurchaseOrdersUseCaseImpl(purchaseOrderRepository, productRepository, translator);

    return {
        productRepository,
        purchaseOrderRepository,
        translator,
        sut
    };
};

export const makeValidPayload = (): BulkCreatePurchaseOrdersUseCase.Params => {
    return [
        {
            date: '2025-01-01',
            total: 30,
            items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
        }
    ];
};

export const makeMultipleValidPayload = (): BulkCreatePurchaseOrdersUseCase.Params => {
    return [
        {
            date: '2025-01-01',
            total: 30,
            items: [{ id: '', product_id: 'valid-product-id', quantity: 2, price: 15, purchaseOrder_id: '' }]
        },
        {
            date: '2025-01-02',
            total: 60,
            items: [{ id: '', product_id: 'another-valid-id', quantity: 3, price: 20, purchaseOrder_id: '' }]
        }
    ];
};
