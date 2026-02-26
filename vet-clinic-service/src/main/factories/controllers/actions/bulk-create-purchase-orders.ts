import { makeBulkCreatePurchaseOrdersUseCase } from '@/main/factories/use-cases/actions/bulk-create-purchase-orders';
import { BulkCreatePurchaseOrdersController } from '@/presentation/actions/bulk-create-purchase-orders';

export const makeBulkCreatePurchaseOrdersController = () => {
    const useCase = makeBulkCreatePurchaseOrdersUseCase();
    return new BulkCreatePurchaseOrdersController(useCase);
};

export const bulkCreatePurchaseOrdersController = makeBulkCreatePurchaseOrdersController();
