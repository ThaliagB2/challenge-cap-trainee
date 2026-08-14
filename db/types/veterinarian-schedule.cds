namespace db.types;

using { db.types.EmergencyProcedureResult } from './emergency-appointment';

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
