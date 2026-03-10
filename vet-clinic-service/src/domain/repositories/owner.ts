import { OwnerModel } from '@/domain/models/db/owner';

export interface OwnerRepository {
    findAll(): Promise<OwnerModel[]>;
    findById(ids: string[]): Promise<OwnerModel[]>;
}
