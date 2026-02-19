namespace db.models;

entity Veterinarians {
    key ID: UUID;
    firstName: String(50);
    lastName: String(100);
    specialty: String(100);
    crmv: String(20);
}