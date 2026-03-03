import cds from '@sap/cds';

import { ProcedureRepository } from '@/domain/repositories';
import { ProcedureModel, ProcedureProps } from '@/domain/models/db/procedure';

export class ProcedureRepositoryImpl implements ProcedureRepository {
    private readonly ENTITY = 'db_models_Procedures';

    public async create(procedure: ProcedureModel[]): Promise<void> {
        const procedureData = procedure.map((procedure) => procedure.toObject());
        await cds.create(this.ENTITY).entries(procedureData);
    }

    public async findByAppointmentId(appointmentId: string): Promise<ProcedureModel[]> {
        const proceduresQuery = SELECT.from(this.ENTITY).where({ appointment_id: appointmentId });
        const procedures: ProcedureProps[] = await cds.run(proceduresQuery);

        if (procedures.length === 0) {
            return [];
        }

        return procedures.map((proc) => ProcedureModel.create({ ...proc }));
    }
}
