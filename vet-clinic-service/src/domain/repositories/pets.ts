import { PetsModel } from '../models/db/pets';

export interface petsRepository {
    findPetsById(id: string): Promise<PetsModel>;
    findOwners(id: string): Promise<PetsModel>;
}
