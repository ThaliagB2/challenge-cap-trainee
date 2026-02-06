using { db.models } from '../../../../db/models';

@path: '/sample'
@requires: 'authenticated-user'
service {{UpperCamelCaseAppName}} {
    entity Products as projection on models.Products {
        *,
        virtual formattedPrice: String
    };
    entity PurchaseOrders as projection on models.PurchaseOrders;
    entity PurchaseOrderItems as projection on models.PurchaseOrderItems;
}

// Functions
extend service {{UpperCamelCaseAppName}} with {
    function extractProductsToExcel() returns String;
}

// Actions
extend service {{UpperCamelCaseAppName}} with {
    action bulkCreatePurchaseOrders(payload: array of {{UpperCamelCaseAppName}}.PurchaseOrders) returns String;
}
