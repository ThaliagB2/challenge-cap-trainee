import { PetsModel } from '../models/db/pets';

export interface petsRepository {
    findPetsById(id: string): Promise<PetsModel | null>;
    findOwnersById(id: string): Promise<PetsModel[]>;
}
