import cds from "@sap/cds";

import { ProcedureRepository } from "@/domain/repositories/procedure";

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly ENTITY_NAME = 'db.models.Procedures';

    public async create(procedure: ProcedureRepository.CreateParams): Promise<ProcedureRepository.CreateResult> {
        const data = procedure.toObject();
        const query = cds.ql.INSERT.into(this.ENTITY_NAME).entries(data);
        await cds.run(query);
    }

}