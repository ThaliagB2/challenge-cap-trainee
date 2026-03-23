import { PetsModel } from '../models/db/pets';

export interface PetsRepository {
    findPetsById(id: PetsRepository.FindByIdParams): Promise<PetsRepository.FindPetsByIdResult>;
    findOwnersById(id: PetsRepository.FindByIdParams): Promise<PetsRepository.FindOwnersByIdResult>;
}

export namespace PetsRepository {
    export type FindByIdParams = string;
    export type FindPetsByIdResult = PetsModel | null;
    export type FindOwnersByIdResult = PetsModel[];
}
