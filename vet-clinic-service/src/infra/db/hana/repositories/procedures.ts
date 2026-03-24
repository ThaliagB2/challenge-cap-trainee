import cds from '@sap/cds';

import { ProceduresModel, ProceduresProps } from '@/domain/models/db/procedures';
import { ProcedureRepository, ProceduresRepository } from '@/domain/repositories';

export class ProceduresRepositoryImpl implements ProceduresRepository {
    private readonly ENTITY = 'db.models.Procedures';
    //refatorado
    public async create(Params: ProcedureRepository.CreateParams): Promise<ProcedureRepository.CreateResult> {
        const proceduresData = Params.map((procedure) => procedure.toObject());
        await cds.create(this.ENTITY).entries(proceduresData);
    }

    public async findByAppointmentId(appointmentId: ProcedureRepository.FindByAppointmentIdParams): Promise<ProcedureRepository.FindByAppointmentIdResult> {
        const proceduresQuery = cds.ql.SELECT.from(this.ENTITY).where({ appointment_id: appointmentId });
        const procedure: ProceduresProps[] = await cds.run(proceduresQuery);

        if (procedure.length === 0) {
            return [];
        }

        return procedure.map((proc) => ProceduresModel.create({ ...proc }));
    }
}
