import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { VeterinariansRepository } from '@/domain/repositories';

export class VeterinariansRepositoryStub implements VeterinariansRepository {
    private veterinarians: VeterinariansModel[] = [];

    public setupVeterinarians(veterinarians: VeterinariansModel[]): void {
        this.veterinarians = veterinarians;
    }

    public addVeterinarian(veterinarian: VeterinariansModel): void {
        this.veterinarians.push(veterinarian);
    }

    public async findVeterinarianById(id: string): Promise<VeterinariansModel | null> {
        const veterinarian = this.veterinarians.find((v) => v.id === id);
        return veterinarian ?? null;
    }
}
