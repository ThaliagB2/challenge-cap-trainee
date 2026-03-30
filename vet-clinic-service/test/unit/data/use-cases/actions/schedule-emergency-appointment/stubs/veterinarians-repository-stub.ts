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

    public async findVeterinarianById(id: string): Promise<VeterinariansModel | null> {
        const vet = this.veterinarians.find((item) => item.id === id);
        return vet ?? null;
    }
}
