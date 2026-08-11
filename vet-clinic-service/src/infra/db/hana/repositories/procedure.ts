import cds from '@sap/cds';

import { ProcedureRepository } from '@/domain/repositories';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly ENTITY_NAME = 'db.models.Procedures';

    public async create(procedure: ProcedureRepository.CreateParams): Promise<ProcedureRepository.CreateResult> {
        const query = cds.ql.INSERT.into(this.ENTITY_NAME).entries(procedure.toObject());

        await cds.run(query);
    }
}
