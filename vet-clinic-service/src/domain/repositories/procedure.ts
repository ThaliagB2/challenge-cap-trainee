import { ProcedureModel } from '@/domain/models/db/procedure';

export interface ProcedureRepository {
    bulkCreate(procedures: ProcedureModel[]): Promise<void>;
}
