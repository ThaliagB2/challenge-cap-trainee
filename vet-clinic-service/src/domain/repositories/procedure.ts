import { ProcedureModel } from '@/domain/models/db/procedure';

export interface ProcedureRepository {
    findAll(): Promise<ProcedureModel[]>;
    findByIds(ids: string[]): Promise<ProcedureModel[]>;
    bulkCreate(procedures: ProcedureModel[]): Promise<void>;
}
