namespace db.types.ProcedureInput;

type ParamsProcedureInput {
    petId: String;
    veterinarianId: String;
    notes: String;
    procedures: array of {
        description: String(255);
        cost: Decimal(10,2);
    };
}

