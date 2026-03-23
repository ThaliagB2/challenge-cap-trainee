import cds from '@sap/cds';

import { ProcedureRepository } from '@/domain/repositories';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly ENTITY = 'db.models.Procedures';

    public async bulkCreate(params: ProcedureRepository.BulkCreateParams): Promise<ProcedureRepository.BulkCreateResult> {
        const procedureData = params.procedures.map((proc) => proc.toCreationObject());
        const query = cds.ql.INSERT.into(this.ENTITY).entries(procedureData);
        await cds.run(query);
    }
}
