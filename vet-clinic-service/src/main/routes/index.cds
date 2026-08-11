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
        veterinarian_id : UUID,
        days: Integer default 7
    ) returns types.VeterinarianScheduleItem;
    function getOwnerExpenseReport(
        owner_id: UUID
    ) returns types.OwnerExpenseReport;
}

// Actions
extend service VetClinicService with {
    action scheduleEmergencyAppointment(
        params: types.EmergencyAppointmentParams
    ) returns types.EmergencyAppointmentResult;
}
