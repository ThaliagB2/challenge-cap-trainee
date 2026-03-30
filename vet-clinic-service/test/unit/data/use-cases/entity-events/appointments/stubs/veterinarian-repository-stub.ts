import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { VeterinariansRepository } from '@/domain/repositories';

export class VeterinariansRepositoryStub implements VeterinariansRepository {
    private veterinarians: VeterinariansModel[] = [];

    public setupVeterinarians(vets: VeterinariansModel[]): void {
        this.veterinarians = vets;
    }

    public addVeterinarian(vet: VeterinariansModel): void {
        this.veterinarians.push(vet);
    }

    async findVeterinarianById(id: string): Promise<VeterinariansModel | null> {
        return this.veterinarians.find(v => v.id === id) || null;
    }
}
