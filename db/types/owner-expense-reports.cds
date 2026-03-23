using { db.models } from '../models';


namespace db.types.OwnerExpenseReports;

type ExpectedResults: {
    ownerId: models.Owners:id;
    totalExpenses: Decimal(10, 2);
    ownerFullname: String(150);
    appointmentCount: Integer;
    averageCost: Decimal(10, 2)
}