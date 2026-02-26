namespace db.models;

using { db.models } from '.';

entity Owners {
    key id: UUID;
    firstName: String(50);
    lastName: String(100);
    phone: String(20);
    email: String(255);
    pets: Association to many models.Pets on pets.owner = $self;
}