import { PetModel } from '@/domain/models/db/pet';

export interface PetRepository {
    findAll(): Promise<PetRepository.FindAllResult>;
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
    export type FindAllResult = PetModel[];
    export type FindByIdResult = PetModel[];
    export type FindByOwnerIdResult = PetModel[];
}
