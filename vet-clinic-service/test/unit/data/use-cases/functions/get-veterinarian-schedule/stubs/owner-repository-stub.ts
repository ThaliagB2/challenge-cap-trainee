import { OwnerRepository } from '@/domain/repositories';
import { OwnerModel } from '@/domain/models/db/owner';

export class OwnerRepositoryStub implements OwnerRepository {
    public owners: OwnerModel[] = [];

    public async findById(id: string): Promise<OwnerModel> {
        const owner = this.owners.find((o) => o.id === id);
        return owner || null;
    }
}

