namespace db.types;

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
