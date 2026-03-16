import { PetRepository } from '@/domain/repositories';
import { PetModel } from '@/domain/models/db/pet';

export class PetRepositoryStub implements PetRepository {
    public pets: PetModel[] = [];

    public async findById(id: string): Promise<PetModel> {
        const pet = this.pets.find((p) => p.id === id);
        return pet || null;
    }

    public async findByOwnerId(id: string): Promise<PetModel[]> {
        const pets = this.pets.filter((p) => p.owner_id === id);
        return pets.length > 0 ? pets : null;
    }
}

