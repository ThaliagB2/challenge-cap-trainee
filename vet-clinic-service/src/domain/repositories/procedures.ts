import { ProceduresModel } from '../models/db/procedures';

export interface proceduresRepository {
    create(procedures: ProceduresModel[]): Promise<void>;
}
