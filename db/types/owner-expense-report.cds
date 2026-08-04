namespace db.types;

type OwnerExpenseReport {
    ownerid: UUID;
    ownerName: String;
    totalExpenses: Decimal(12,2);
    appointmentCount: Integer;
}