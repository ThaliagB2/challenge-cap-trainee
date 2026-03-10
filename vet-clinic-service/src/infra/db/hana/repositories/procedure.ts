import { ProcedureModel } from '@/domain/models/db/procedure';
import { ProcedureRepository } from '@/domain/repositories';
import cds from '@sap/cds';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly PROCEDURE = 'db.models.Procedure';

    public async bulkCreate(procedures: ProcedureModel[]): Promise<void> {
        const procedureData = procedures.map((proc) => proc.toCreationObject());
        const query = cds.ql.INSERT.into(this.PROCEDURE).entries(procedureData);
        await cds.run(query);
    }
}
