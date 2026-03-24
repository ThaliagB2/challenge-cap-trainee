import { PetsModel } from '../models/db/pets';

export interface PetsRepository {
    findPetsById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindPetsByIdResult>;
    findOwnersById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindOwnersByIdResult>;
}

export namespace PetRepository {
    export type FindByIdParams = string;
    export type FindPetsByIdResult = PetsModel | null;
    export type FindOwnersByIdResult = PetsModel[];
}
