using {db.models} from '../models';

namespace db.types.GetVeterinarianSchedule;

type Payload {
    veterinarian_id : models.Appointments:veterinarian.id;
    days            : Integer;
};

type ExpectedResult {
    id              : models.Appointments:id;
    date            : models.Appointments:date;
    status          : models.Appointments:status;
    isEmergency     : models.Appointments:isEmergency;
    totalCost       : models.Appointments:totalCost;
    notes           : models.Appointments:notes;
    pet_id          : models.Pets:id;
    veterinarian_id : models.Veterinarians:id;
    procedures      : array of ProceduresResult;
}

type ProceduresResult {
    id          : models.Procedures:id;
    description : models.Procedures:description;
    cost        : models.Procedures:cost;
    appointment : models.Appointments:id;
}
