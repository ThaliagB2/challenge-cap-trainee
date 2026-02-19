import { PetModel } from '../models/db/pet';

export interface PetRepository {
    findById(id: string): Promise<PetModel>;
    findByOwnerId(id: string): Promise<PetModel[]>;
}
