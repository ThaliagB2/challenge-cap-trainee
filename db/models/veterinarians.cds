namespace db.models;

entity Veterinarians {
    key id: UUID;
    firstName: String(50);
    lastName: String(100);
    specialty: String(100);
    state: String(2);
    crmv: Decimal(5);
}