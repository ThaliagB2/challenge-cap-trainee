using { db.models } from '../../../../db/models';
using { db.types } from '../../../../db/types';

@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    // projeto clínica veterinária 
    entity Owners as projection on models.Owners;
    entity Pets as projection on models.Pets;
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments as projection on models.Appointments;
    entity Procedures as projection on models.Procedures;
}

extend service VetClinicService with {
    function getVeterinarianSchedule(veterinarianId: String, days: Integer) returns array of types.VeterinarianSchedule;
    function getOwnerExpenseReport(ownerId: String) returns String;
};

extend service VetClinicService with {
    action scheduleEmergencyAppointment(petId: String, veterinarianId: String, notes: String, procedures: array of types.ProcedureInput) returns String;
};


