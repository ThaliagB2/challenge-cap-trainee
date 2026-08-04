namespace db.types;

type OwnerExpenseReport {
    ownerId: UUID;
        ownerName: String;
        totalExpenses: Decimal(12,2);
        appointmentCount: Integer;
}