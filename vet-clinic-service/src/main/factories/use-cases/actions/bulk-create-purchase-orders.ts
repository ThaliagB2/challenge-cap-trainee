import { BulkCreatePurchaseOrdersUseCaseImpl } from '@/data/use-cases/actions/bulk-create-purchase-orders';
import { ProductRepositoryImpl } from '@/infra/db/hana/repositories/procedures';
import { PurchaseOrderRepositoryImpl } from '@/infra/db/hana/repositories/purchase-order';
import { translator } from '@/main/factories/utils/translator';

export const makeBulkCreatePurchaseOrdersUseCase = () => {
    const purchaseOrderRepository = new PurchaseOrderRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    return new BulkCreatePurchaseOrdersUseCaseImpl(purchaseOrderRepository, productRepository, translator);
};
