import { OwnerModel } from '@/domain/models/db/owner';

export interface OwnerRepository {
    findById(id: string): Promise<OwnerModel>;
}
