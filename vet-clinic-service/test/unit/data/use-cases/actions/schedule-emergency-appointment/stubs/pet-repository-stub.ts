import { PetModel } from '@/domain/models/db/pet';
import { PetRepository } from '@/domain/repositories';

export class PetRepositoryStub implements PetRepository {
    private error: Error | null = null;
    private validPetIds = ['valid-pet-id'];

    public setError(error: Error): void {
        this.error = error;
    }

    public async findById(id: string): Promise<PetModel> {
        if (this.error) {
            throw this.error;
        }

        if (!this.validPetIds.includes(id)) {
            return null;
        }

        return PetModel.create({
            id: id,
            name: 'Rex',
            species: 'Cachorro',
            breed: 'Labrador',
            birthDate: new Date('2020-03-15'),
            weight: 28.5,
            owner_id: 'owner-123'
        });
    }

    public async findByOwnerId(id: string): Promise<PetModel[]> {
        return [];
    }
}

