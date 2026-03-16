import { VeterinarianRepository } from '@/domain/repositories';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export class VeterinarianRepositoryStub implements VeterinarianRepository {
    public veterinarians: VeterinarianModel[] = [];

    public async findById(id: string): Promise<VeterinarianModel> {
        const veterinarian = this.veterinarians.find((vet) => vet.id === id);
        return veterinarian || null;
    }
}

