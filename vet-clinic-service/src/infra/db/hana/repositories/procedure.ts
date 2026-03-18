import cds from '@sap/cds';

import { ProcedureModel, ProcedureProps } from '@/domain/models/db/procedure';
import { ProcedureRepository } from '@/domain/repositories';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly ENTITY = 'db.models.Procedures';

    public async findAll(): Promise<ProcedureRepository.FindAllResult> {
        const query = cds.ql.SELECT.from(this.ENTITY);
        const result: ProcedureProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => ProcedureModel.with(r));
    }

    public async findById(params: ProcedureRepository.FindByIdsParams): Promise<ProcedureRepository.FindByIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ id: params.id });
        const result: ProcedureProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => ProcedureModel.with(r));
    }

    public async bulkCreate(params: ProcedureRepository.BulkCreateParams): Promise<ProcedureRepository.BulkCreateResult> {
        const procedureData = params.procedures.map((proc) => proc.toCreationObject());
        const query = cds.ql.INSERT.into(this.ENTITY).entries(procedureData);
        await cds.run(query);
    }
}
