using { db.models } from '../../../../db/models';

@path: '/vet-clinic'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners as projection on models.Owners;
    entity Pets as projection on models.Pets;
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments as projection on models.Appointments;
    entity Procedures as projection on models.Procedures;

    type EmergencyProcedureInput {
        description : String(255);
        cost        : Decimal(10, 2);
    }

    type EmergencyProcedureResult {
        id             : UUID;
        description    : String(255);
        cost           : Decimal(10, 2);
        appointment_id : UUID;
    }

    type EmergencyPetResult {
        id        : UUID;
        name      : String(100);
        species   : String(50);
        breed     : String(100);
        birthDate : Date;
        weight    : Decimal(5, 2);
        owner_id  : UUID;
    }

    type EmergencyVeterinarianResult {
        id        : UUID;
        firstName : String(50);
        lastName  : String(100);
        specialty : String(100);
        crmv      : String(20);
    }

    type EmergencyAppointmentResult {
        id           : UUID;
        date         : DateTime;
        status       : String;
        isEmergency  : Boolean;
        totalCost    : Decimal(12, 2);
        notes        : String(500);
        pet          : EmergencyPetResult;
        procedures   : many EmergencyProcedureResult;
        veterinarian : EmergencyVeterinarianResult;
    }

    type ScheduleOwnerResult {
        id        : UUID;
        firstName : String(50);
        lastName  : String(100);
        phone     : String(20);
        email     : String(255);
    }

    type SchedulePetResult {
        id        : UUID;
        name      : String(100);
        species   : String(50);
        breed     : String(100);
        birthDate : Date;
        weight    : Decimal(5, 2);
        owner_id  : UUID;
        owner     : ScheduleOwnerResult;
    }

    type VeterinarianScheduleItem {
        id              : UUID;
        date            : DateTime;
        status_id       : String;
        isEmergency     : Boolean;
        totalCost       : Decimal(12, 2);
        notes           : String(500);
        pet_id          : UUID;
        veterinarian_id : UUID;
        procedures      : many EmergencyProcedureResult;
        pet             : SchedulePetResult;
    }

    type OwnerExpenseReport {
        ownerId          : UUID;
        ownerName        : String;
        totalExpenses    : Decimal(12, 2);
        appointmentCount : Integer;
        averageCost      : Decimal(12, 2);
    }

    action scheduleEmergencyAppointment(
        petId          : UUID,
        veterinarianId : UUID,
        notes          : String(500),
        procedure      : many EmergencyProcedureInput
    ) returns EmergencyAppointmentResult;

    function getVeterinarianSchedule(
        veterinarianId : UUID,
        days            : Integer
    ) returns many VeterinarianScheduleItem;

    function getOwnerExpenseReport(
        ownerId : UUID
    ) returns OwnerExpenseReport;
}
