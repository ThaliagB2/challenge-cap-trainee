import { PetModel } from '@/domain/models/db/pet';

export interface PetRepository {
    findAll(): Promise<PetModel[]>;
    findById(ids: string[]): Promise<PetModel[]>;
    findByOwnerId(ids: string[]): Promise<PetModel[]>;
}
