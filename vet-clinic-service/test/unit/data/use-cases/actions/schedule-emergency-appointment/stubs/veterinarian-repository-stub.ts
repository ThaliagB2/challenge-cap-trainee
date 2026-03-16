import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { VeterinarianRepository } from '@/domain/repositories';

export class VeterinarianRepositoryStub implements VeterinarianRepository {
    private error: Error | null = null;
    private validVetIds = ['valid-vet-id'];

    public setError(error: Error): void {
        this.error = error;
    }

    public async findById(id: string): Promise<VeterinarianModel> {
        if (this.error) {
            throw this.error;
        }

        if (!this.validVetIds.includes(id)) {
            return null;
        }

        return VeterinarianModel.create({
            id: id,
            firstName: 'Dr. João',
            lastName: 'Silva',
            specialty: 'Cirurgia',
            crmv: 'CRMV-SP 12345'
        });
    }
}

