namespace db.models;
entity Owners {
    key id: UUID;
        firstName: String(50);
        lastName: String(100);
        phone: String(20);
        email: String(100);
        pets: Association to many models.Pets on pets.owner=$self;
}