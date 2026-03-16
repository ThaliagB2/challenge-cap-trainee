import { ProcedureRepository } from '@/domain/repositories';
import { ProcedureModel } from '@/domain/models/db/procedure';

export class ProcedureRepositoryStub implements ProcedureRepository {
    public procedures: Map<string, ProcedureModel[]> = new Map();

    public async create(procedures: ProcedureModel[]): Promise<void> {
        // Not needed for this test
    }

    public async findByAppointmentId(appointmentId: string): Promise<ProcedureModel[]> {
        return this.procedures.get(appointmentId) || [];
    }
}

