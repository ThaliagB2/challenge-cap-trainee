import cds from '@sap/cds';

import { ProceduresModel, ProceduresProps } from '@/domain/models/db/procedures';
import { proceduresRepository } from '@/domain/repositories';

export class ProceduresRepositoryImpl implements proceduresRepository {
    private readonly ENTITY = 'db_models_Procedures';

    public async create(procedures: ProceduresModel[]): Promise<void> {
        const proceduresData = procedures.map((procedure) => procedure.toObject());
        await cds.create(this.ENTITY).entries(proceduresData);
    }

    public async findByAppointmentId(appointmentId: string): Promise<ProceduresModel[]> {
        const proceduresQuery = cds.ql.SELECT.from(this.ENTITY).where({ appointment_id: appointmentId });
        const procedure: ProceduresProps[] = await cds.run(proceduresQuery);

        if (procedure.length === 0) {
            return [];
        }

        return procedure.map((proc) => ProceduresModel.create({ ...proc }));
    }
}
