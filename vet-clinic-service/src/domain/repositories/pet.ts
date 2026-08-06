import { PetModel } from '@/domain/models/db/pet';

export interface PetRepository {
    findById(id: string): Promise<PetModel | null>;
    findByOwnerId(ownerId: string): Promise<PetModel[]>;
}
