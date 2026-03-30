import { OwnersModel } from '@/domain/models/db/owners';
import { OwnersRepository } from '@/domain/repositories';

export class OwnersRepositoryStub implements OwnersRepository {
    private owners: OwnersModel[] = [];

    public setupOwners(owners: OwnersModel[]): void {
        this.owners = owners;
    }

    public addOwner(owner: OwnersModel): void {
        this.owners.push(owner);
    }

    public async findOwnersById(params: { id: string }): Promise<OwnersModel | null> {
        const owner = this.owners.find((o) => o.id === params.id);
        return owner ?? null;
    }
}