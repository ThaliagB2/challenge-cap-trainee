using { db.models } from '../models';

namespace db.types;

type ParamsOwner: {
    ownerId: Integer;
}

type OwnerExpenseReport: {
    ownerId: models.Owners:id;
    ownerFullName: String(150);
    totalExpenses: Decimal(10, 2);
    appointmentCount: Integer;
    averageCost: Decimal(10, 2);
}