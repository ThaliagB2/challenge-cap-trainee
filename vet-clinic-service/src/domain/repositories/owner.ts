import { OwnerModel } from '@/domain/models/db/owner';

export interface OwnerRepository {
    findAll(): Promise<OwnerRepository.FindAllResult>;
    findById(params: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult>;
}

export namespace OwnerRepository {
    export type FindByIdParams = {
        id: string;
    };
    export type FindByIdResult = OwnerModel[];
    export type FindAllResult = OwnerModel[];
}
