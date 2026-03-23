namespace db.types.ProceduresInput;

type ProceduresParamsInput {
    petId: String;
    veterinarianId: String;
    notes: String;
    procedures: array of {
        cost: Decimal(10, 2);
        description: String(300);
    }
}
