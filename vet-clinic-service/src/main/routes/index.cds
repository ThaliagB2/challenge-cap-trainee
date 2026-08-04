using { db.models } from '../../../../db/models';
using { db.types } from '../../../../db/types';


@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners as projection on models.Owners;
    entity Pets as projection on models.Pets;
    entity Veterinarians as projection on models.Veterinarians;
    entity Procedures as projection on models.Procedures;
    entity Appointments as projection on models.Appointments;
}

// Functions
extend service VetClinicService with {
    function getVeterinarianScheduleItem(
        veterinarianId : UUID,
        days: Integer default 7
    ) returns types.VeterinarianScheduleItem;
    function getOwnerExpenseReport(
        ownerid: UUID
    ) returns types.OwnerExpenseReport;
}

// Actions
extend service VetClinicService with {
    action scheduleEmergencyAppointment(
        petId: UUID,
        veterinarianId: UUID,
        notes: String,
        procedure: array of types.EmergencyProcedureInput
        
        ) returns types.EmergencyAppointmentResult;
}
