using { db.models } from '../models';


namespace db.types.OwnerExpanceReports;

type ExpectedResults: {
    ownerId: models.Owners:id;
    totalExpence: Decimal(10, 2);
    ownerFullname: String(150);
    Appointments: Integer;
    averageCost: Decimal(10, 2)
}