namespace db.models;

using { db.models.Owners } from './owners';


entity Pets {
    key ID: UUID;
    name: String(100);
    species: String(50);
    breed: String(100);
    birthDate: Date;
    weight: Decimal(5,2);
    owner: Association to Owners;
}