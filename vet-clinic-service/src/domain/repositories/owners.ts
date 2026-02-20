import { OwnersModel } from '../models/db/owners';

export interface ownersRepository {
    findownersById(id: string): Promise<OwnersModel>;
}
