import { OwnersModel } from '../models/db/owners';

export interface ownersRepository {
    findOwnersById(id: string): Promise<OwnersModel>;
}
