import cds from "@sap/cds";

import { ProcedureModel } from "@/domain/models/db/procedure";
import { ProcedureRepository } from "@/domain/repositories/procedure";

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly ENTITY_NAME = 'db.models.Procedures';

    public async create(procedure: ProcedureModel): Promise<void> {
        const data = procedure.toObject();
        const query = cds.ql.INSERT.into(this.ENTITY_NAME).entries(data);
        await cds.run(query);
    }

}