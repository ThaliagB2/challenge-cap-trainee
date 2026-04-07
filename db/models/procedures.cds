using { db.models } from '.';

namespace db.models;

entity Procedures {
    key id: UUID;
        description: String(255) not null;
        cost: Decimal(10,2) not null;
        appointment: Association to models.Appointments;
}
