namespace db.types.ProceduresInput;

type ProceduresParamsInput {
    pet_id: String;
    veterinarian_id: String;
    notes: String;
    procedures: array of {
        cost: Decimal(10, 2);
        description: String(300);
    }
}
