namespace db.models;

using { db.models } from '.';

entity Procedures {
    key id: UUID;
    description: String(255);
    cost: Decimal(10,2);
    appointment: Association to models.Appointments;
}