import { ProcedureModel } from '@/domain/models/db/procedure';

export interface ProcedureRepository {
    create(procedure: ProcedureModel): Promise<void>;
}
