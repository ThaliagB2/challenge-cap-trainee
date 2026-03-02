using { db.models } from '../models';

namespace db.types.OwnerExpenseReport;

type ExpectedResult: {
    ownerId: models.Owners:id;
    ownerFullName: String(150);
    totalExpenses: Decimal(10, 2);
    appointmentCount: Integer;
    averageCost: Decimal(10, 2);
}