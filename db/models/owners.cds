using { db.models } from '.';

namespace db.models;

entity Owners {
    key id: UUID;
        firstName: String(50) not null;
        lastName: String(100) not null;
        phone: String(20);
        email: String(255);
        pets: Association to many models.Pets on pets.owner = $self;
}
