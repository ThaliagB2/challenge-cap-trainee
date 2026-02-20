import { ProduresModel } from '../models/db/procedures';

export interface proceduresRepository {
    create(procedures: ProduresModel): Promise<ProduresModel>;
}
