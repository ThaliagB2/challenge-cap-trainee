import { PetModel } from '@/domain/models/db/pet';

export interface PetRepository {
    findAll(): Promise<PetModel[]>;
    findById(ids: string[]): Promise<PetModel[]>;
    findByOwnerId(id: string): Promise<PetModel[]>;
}
