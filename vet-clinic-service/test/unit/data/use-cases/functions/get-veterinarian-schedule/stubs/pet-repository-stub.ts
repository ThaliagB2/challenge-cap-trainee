import { PetsModel } from '@/domain/models/db/pets';
import { PetsRepository } from '@/domain/repositories';

export class PetsRepositoryStub implements PetsRepository {
    private pets: PetsModel[] = [];

    public setupPets(pets: PetsModel[]): void {
        this.pets = pets;
    }

    public addPet(pet: PetsModel): void {
        this.pets.push(pet);
    }

    public async findPetsById(id: string): Promise<PetsModel | null> {
        const pet = this.pets.find((p) => p.id === id);
        return pet ?? null;
    }

    public async findOwnersById(id: string): Promise<PetsModel[]> {
        return this.pets.filter((p) => p.owner_id === id);
    }
}
