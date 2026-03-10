import cds from '@sap/cds';

import { OwnerModel } from '@/domain/models/db/owner';
import { PetModel } from '@/domain/models/db/pet';
import { OwnerRepository } from '@/domain/repositories';
import { Owners } from '@models/db/models';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly OWNER = 'db.models.Owner';

    public async findAll(): Promise<OwnerModel[]> {
        const ownerQuery = cds.ql.SELECT.from(this.OWNER);
        const owners: Owners = await cds.run(ownerQuery);

        if (owners.length === 0) return null;

        return owners.map((owner) =>
            OwnerModel.with({
                id: owner.id as string,
                firstName: owner.firstName as string,
                lastName: owner.lastName as string,
                phone: owner.phone as string,
                email: owner.email as string,
                pets: owner.pets as unknown as PetModel[]
            })
        );
    }

    public async findById(ids: string[]): Promise<OwnerModel[]> {
        const ownerQuery = cds.ql.SELECT.from(this.OWNER).where({ id: { in: ids } });
        const owners: Owners = await cds.run(ownerQuery);

        if (owners.length === 0) return null;

        return owners.map((owner) =>
            OwnerModel.with({
                id: owner.id as string,
                firstName: owner.firstName as string,
                lastName: owner.lastName as string,
                phone: owner.phone as string,
                email: owner.email as string,
                pets: owner.pets as unknown as PetModel[]
            })
        );
    }
}
