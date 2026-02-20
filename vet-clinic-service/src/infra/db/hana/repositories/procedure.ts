import cds from '@sap/cds';

import { ProcedureModel } from '@/domain/models/db/procedure';
import { ProcedureRepository } from '@/domain/repositories';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    async create(procedure: ProcedureModel[]): Promise<void> {
        const procedureData = procedure.map((procedure) => procedure.toObject());
        await cds.create('Procedures').entries(procedureData);
    }
}
