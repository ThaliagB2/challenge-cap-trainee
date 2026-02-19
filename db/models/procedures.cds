namespace db.models;

using { db.models.Appointments } from './appointments';

entity Procedures {
    key ID: UUID;
    description: String(255);
    cost: Decimal(10,2);
    appointment: Association to Appointments;
}