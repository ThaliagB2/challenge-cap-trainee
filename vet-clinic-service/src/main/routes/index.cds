using { db.models } from '../../../../db/models';
using { db.types.VeterinarianSchedule, db.types.OwnerExpenseReport, db.types.ProcedureInput } from '../../../../db/types';

@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners as projection on models.Owners;
    entity Pets as projection on models.Pets {
        *,
        virtual age: Integer
    };
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments as projection on models.Appointments;
    entity Procedures as projection on models.Procedures;
}

extend service VetClinicService with {
    function getVeterinarianSchedule(veterinarianId: String, days: Integer) returns array of VeterinarianSchedule.ExpectedResult;
    function getOwnerExpenseReport(ownerId: String) returns OwnerExpenseReport.ExpectedResult;
};

extend service VetClinicService with {
    action scheduleEmergencyAppointment(payload: ProcedureInput.ParamsProcedureInput) returns String;
};


