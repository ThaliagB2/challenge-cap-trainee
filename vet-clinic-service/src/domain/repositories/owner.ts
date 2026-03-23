import { OwnerModel } from '@/domain/models/db/owner';

export interface OwnerRepository {
    findById(params: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult>;
}

export namespace OwnerRepository {
    export type FindByIdParams = {
        id: string;
    };
    export type FindByIdResult = OwnerModel;
}
