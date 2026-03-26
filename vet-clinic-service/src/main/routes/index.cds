using { db.models } from '../../../../db/models';
using { db.types.VeterinariansSchedule, db.types.OwnerExpenseReports, db.types.ProceduresInput } from '../../../../db/types';


@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners as projection on models.Owners;
    entity Pets as projection on models.Pets{
        *,
        virtual age: Integer
    };
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments as projection on models.Appointments;
    entity Procedures as projection on models.Procedures;

    action scheduleEmergencyAppointment(params: ProceduresInput.ProceduresParamsInput) returns String;
}
extend service VetClinicService with {
    function getVeterinarianSchedule(params: VeterinariansSchedule.VeterinarianParams) returns array of VeterinariansSchedule.ExpectedResults;
    function getOwnerExpenseReport(ownerId: String) returns OwnerExpenseReports.ExpectedResults;
};
