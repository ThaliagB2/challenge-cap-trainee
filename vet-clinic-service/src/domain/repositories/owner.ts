import { OwnerModel } from '@/domain/models/db/owner';

export interface OwnerRepository {
    findById(id: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult>;
}

export namespace OwnerRepository {
    export type FindByIdParams = string;
    export type FindByIdResult = OwnerModel | null;
}
