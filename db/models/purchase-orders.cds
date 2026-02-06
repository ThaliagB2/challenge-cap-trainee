namespace db.models;

using { db.models } from '.';

entity PurchaseOrders {
    key id: UUID;
        date: Date;
        total: Decimal;
        items: Composition of many models.PurchaseOrderItems ON items.purchaseOrder = $self;
}
