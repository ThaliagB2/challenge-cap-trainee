import { makeBeforeCreatePurchaseOrderUseCase } from '@/main/factories/use-cases/entity-events/purchase-order';
import { BeforeCreatePurchaseOrderController } from '@/presentation/entity-events/purchase-order';

export const makeBeforeCreatePurchaseOrderController = () => {
    const useCase = makeBeforeCreatePurchaseOrderUseCase();
    return new BeforeCreatePurchaseOrderController(useCase);
};

export const beforeCreatePurchaseOrderController = makeBeforeCreatePurchaseOrderController();
