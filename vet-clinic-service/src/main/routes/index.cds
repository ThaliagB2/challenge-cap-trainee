using { db.models } from '../../../../db/models';
using { db.types } from '../../../../db/types';

@path: '/vet-clinic'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners as projection on models.Owners;
    entity Pets as projection on models.Pets;
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments as projection on models.Appointments;
    entity Procedures as projection on models.Procedures;

    action scheduleEmergencyAppointment(
        petId          : UUID,
        veterinarianId : UUID,
        notes          : String(500),
        procedure      : many types.EmergencyProcedureInput
    ) returns types.EmergencyAppointmentResult;

    function getVeterinarianSchedule(
        veterinarianId : UUID,
        days            : Integer
    ) returns many types.VeterinarianScheduleItem;

    function getOwnerExpenseReport(
        ownerId : UUID
    ) returns types.OwnerExpenseReport;
}
