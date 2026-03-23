using {db.models} from '../../../../db/models';
using {db.types.ScheduleEmergencyAppointment} from '../../../../db/types';
using {db.types.GetVeterinarianSchedule} from '../../../../db/types';
using {db.types.GetOwnerExpenseReport} from '../../../../db/types';

@path    : '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    entity Products           as
        projection on models.Products {
            *,
            virtual formattedPrice : String
        };

    entity PurchaseOrders     as projection on models.PurchaseOrders;
    entity PurchaseOrderItems as projection on models.PurchaseOrderItems;
    entity Appointments       as projection on models.Appointments;
    entity Owners             as projection on models.Owners;
    entity Pets               as projection on models.Pets;
    entity Procedures         as projection on models.Procedures;
    entity Veterinarians      as projection on models.Veterinarians;
}

// Functions
extend service VetClinicService with {
    function extractProductsToExcel()                                                    returns String;
    function getOwnerExpenseReport(payload: GetOwnerExpenseReport.Payload)               returns GetOwnerExpenseReport.ExpectedResult;
    function getVeterinarianSchedule(payload: GetVeterinarianSchedule.Payload)           returns array of GetVeterinarianSchedule.ExpectedResult;
}

// Actions
extend service VetClinicService with {
    action   bulkCreatePurchaseOrders(payload: array of VetClinicService.PurchaseOrders) returns String;
    action   scheduleEmergencyAppointment(payload: ScheduleEmergencyAppointment.Payload) returns ScheduleEmergencyAppointment.ExpectedResult;
}
