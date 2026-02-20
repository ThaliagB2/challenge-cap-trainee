namespace db.models;

entity Procedures {
    key ID: UUID;
    description: String(255);
    cost: Decimal(10,2);
}