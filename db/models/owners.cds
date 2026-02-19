namespace db.models;

entity Owners {
    key id: UUID;
        firstName: String(50);
        lastName: String(100);
        phone: String(20);
        email: String(255);
}