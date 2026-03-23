import { PetModel } from '@/domain/models/db/pet';

export interface PetRepository {
    findById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindByIdResult>;
    findByOwnerId(id: PetRepository.FindByOwnerIdParams): Promise<PetRepository.FindByOwnerIdResult>;
}

export namespace PetRepository {
    export type FindByIdParams = string;
    export type FindByIdResult = PetModel;
    export type FindByOwnerIdParams = string;
    export type FindByOwnerIdResult = PetModel[];
}
