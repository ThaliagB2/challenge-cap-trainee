import cds from '@sap/cds';

import { PurchaseOrderModel } from '@/domain/models/db/purchase-order';
import { PurchaseOrderRepository } from '@/domain/repositories';

export class PurchaseOrderRepositoryImpl implements PurchaseOrderRepository {
    private readonly ENTITY_NAME = 'db.models.PurchaseOrders';

    public async bulkCreate(purchaseOrders: PurchaseOrderModel[]): Promise<void> {
        const purchaseOrdersData = purchaseOrders.map((po) => po.toCreationObject());
        const query = cds.ql.INSERT.into(this.ENTITY_NAME).entries(purchaseOrdersData);
        await cds.run(query);
    }
}
