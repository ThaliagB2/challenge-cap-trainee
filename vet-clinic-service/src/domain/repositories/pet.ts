import { PetModel } from '@/domain/models/db/pet';

export interface PetRepository {
    findById(params: PetRepository.FindByIdParams): Promise<PetRepository.FindByIdResult>;
    findByOwnerId(params: PetRepository.FindByOwnerIdParams): Promise<PetRepository.FindByOwnerIdResult>;
}

export namespace PetRepository {
    export type FindByIdParams = {
        id: string;
    };
    export type FindByOwnerIdParams = {
        ownerId: string;
    };
    export type FindByIdResult = PetModel;
    export type FindByOwnerIdResult = PetModel[];
}
