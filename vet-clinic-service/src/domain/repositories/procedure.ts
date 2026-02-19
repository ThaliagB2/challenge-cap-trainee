import { ProcedureModel } from '../models/db/procedure';

export interface ProcedureRepository {
    create(procedure: ProcedureModel): Promise<ProcedureModel>;
}
