import { OwnersModel } from '@/domain/models/db/owners';

export interface ownersRepository {
    findOwnersById(id: string): Promise<OwnersModel>;
}
