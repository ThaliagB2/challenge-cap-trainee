namespace db.models;

using { managed } from '@sap/cds/common';
using { db.models } from '.';

entity Appointments : managed {
    key id       : UUID;
    date         : DateTime;
    status       : Association to models.Status;
    isEmergency  : Boolean;
    totalCost    : Decimal(12, 2);
    notes        : String(500);
    pet          : Association to one models.Pets not null;
    veterinarian : Association to one models.Veterinarians not null;
    procedures   : Composition of many models.Procedures
                       on procedures.appointment = $self;
}