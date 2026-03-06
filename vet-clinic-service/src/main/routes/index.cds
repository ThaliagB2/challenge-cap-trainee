using { db.models } from '../../../../db/models';

@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    entity Products as projection on models.Products {
        *,
        virtual formattedPrice: String
    };
    entity PurchaseOrders as projection on models.PurchaseOrders;
    entity PurchaseOrderItems as projection on models.PurchaseOrderItems;
}

// Functions
extend service VetClinicService with {
    function extractProductsToExcel() returns String;
}

// Actions
extend service VetClinicService with {
    action bulkCreatePurchaseOrders(payload: array of VetClinicService.PurchaseOrders) returns String;
}
