namespace db.models;

using {db.models} from '.';
using {managed} from '@sap/cds/common';

type AppointmentStatus : String enum {
    SCHEDULED;
    IN_PROGRESS;
    COMPLETED;
    CANCELLED;
}

entity Appointments : managed {
    key id           : UUID;
        date         : DateTime;
        status       : AppointmentStatus;
        isEmergency  : Boolean;
        totalCost    : Decimal(12, 2);
        notes        : String(500);
        procedures   : Composition of many models.Procedures on procedures.appointment = $self;
        owner        : Association to models.Owners;
        pet          : Association to models.Pets;
        veterinarian : Association to models.Veterinarians;
}
