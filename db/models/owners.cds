namespace db.models;

using { db.models.Pets } from './pets';


entity Owners {
    key ID: UUID;
    firstName: String(50);
    lastName: String(100);
    phone: String(20);
    email: String(255);
    pets: Composition of many Pets on pets.owner = $self;
}