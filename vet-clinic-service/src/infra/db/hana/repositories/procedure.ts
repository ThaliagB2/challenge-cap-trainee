import { AppointmentModel } from '@/domain/models/db/appointment';
import { ProcedureModel } from '@/domain/models/db/procedure';
import { ProcedureRepository } from '@/domain/repositories';
import { Procedure, Procedures } from '@models/db/models';
import cds from '@sap/cds';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly PROCEDURE = 'db.models.Procedure';

    public async findAll(): Promise<ProcedureModel[] | null> {
        const procedureQuery = cds.ql.SELECT.from(this.PROCEDURE);
        const procedures: Procedures = await cds.run(procedureQuery);

        if (procedures.length === 0) return null;

        return procedures.map((proc) => this.modelProcedureObject(proc));
    }

    public async findByIds(ids: string[]): Promise<ProcedureModel[] | null> {
        const procedureQuery = cds.ql.SELECT.from(this.PROCEDURE).where({ id: { in: ids } });
        const procedures: Procedures = await cds.run(procedureQuery);

        if (procedures.length === 0) return null;

        return procedures.map((proc) => this.modelProcedureObject(proc));
    }

    public async bulkCreate(procedures: ProcedureModel[]): Promise<void> {
        const procedureData = procedures.map((proc) => proc.toCreationObject());
        const query = cds.ql.INSERT.into(this.PROCEDURE).entries(procedureData);
        await cds.run(query);
    }

    private modelProcedureObject(procedure: Procedure): ProcedureModel {
        return ProcedureModel.with({
            id: procedure.id,
            name: procedure.name,
            description: procedure.description,
            cost: procedure.cost,
            appointment: procedure.appointment as unknown as AppointmentModel
        });
    }
}
