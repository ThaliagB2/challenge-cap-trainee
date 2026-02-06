namespace db.models;

using { db.models } from '.';

entity PurchaseOrderItems {
    key id: UUID;
        quantity: Integer;
        price: Decimal;
        purchaseOrder: Association to models.PurchaseOrders;
        product: Association to models.Products;
}