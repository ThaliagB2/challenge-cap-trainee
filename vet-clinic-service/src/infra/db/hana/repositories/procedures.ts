import cds from '@sap/cds';

import { ProceduresModel } from '@/domain/models/db/procedures';
import { proceduresRepository } from '@/domain/repositories';

export class ProceduresRepositoryImpl implements proceduresRepository {
    async create(procedures: ProceduresModel[]): Promise<void> {
        const proceduresData = procedures.map((procedure) => procedure.toObject());
        await cds.create('procedures').entries(proceduresData);
    }
}
