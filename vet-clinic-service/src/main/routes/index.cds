using { db.models } from '../../../../db/models';

@path: '/vet-clinic'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners              as projection on models.Owners;
    entity Pets                as projection on models.Pets;
    entity Veterinarians       as projection on models.Veterinarians;
    entity AppointmentStatuses as projection on models.AppointmentStatuses;
    entity Appointments        as projection on models.Appointments;
    entity Procedures          as projection on models.Procedures;
    entity Products as projection on models.Products {
        *,
        virtual formattedPrice: String
    };
    entity PurchaseOrders      as projection on models.PurchaseOrders;
    entity PurchaseOrderItems  as projection on models.PurchaseOrderItems;
}

extend service VetClinicService with {
    function extractProductsToExcel() returns String;
}

extend service VetClinicService with {
    action bulkCreatePurchaseOrders(payload: array of VetClinicService.PurchaseOrders) returns String;
}
