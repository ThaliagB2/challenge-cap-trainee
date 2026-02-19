import { OwnerModel } from '../models/db/owner';

export interface OwnerRepository {
    findById(id: string): Promise<OwnerModel>;
}
