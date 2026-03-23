using {db.models} from '../models';

namespace db.types.GetOwnerExpenseReport;

type Payload {
    owner_id : models.Owners:id;
};

type ExpectedResult {
    id               : models.Owners:id;
    name             : String;
    totalExpense     : Decimal;
    appointmentCount : Integer;
    averageCost      : Decimal;
}
