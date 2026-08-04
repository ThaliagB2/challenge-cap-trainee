import { PurchaseOrderModel } from '@/domain/models/db/purchase-order';

export interface PurchaseOrderRepository {
    bulkCreate(purchaseOrders: PurchaseOrderModel[]): Promise<void>;
}
