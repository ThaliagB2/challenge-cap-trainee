namespace db.models;

using { managed } from '@sap/cds/common';

using { db.types.status } from '../types/appontments-status';
using { db.models.Pets } from './pets';
using { db.models.Veterinarians } from './veterinarians';
using { db.models.Procedures } from './procedures';

entity Appointments : managed {
    key ID: UUID;
    date: DateTime;
    status: status;
    isEmergency: Boolean;
    totalCost: Decimal(12,2);
    notes: String(500);
    pet: Association to Pets;
    veterinarian: Association to Veterinarians;
    procedures: Composition of many Procedures on procedures.appointment = $self;
}