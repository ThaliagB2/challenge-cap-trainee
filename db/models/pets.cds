using { db.models } from '.';

namespace db.models;

entity Pets {
    key id: UUID;
        name: String(100) not null;
        species: String(50);
        breed: String(100);
        birthDate: Date;
        weight: Decimal(5,2);
        owner: Association to models.Owners not null;
}
