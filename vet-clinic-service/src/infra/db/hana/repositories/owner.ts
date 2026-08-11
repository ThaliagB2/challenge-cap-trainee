import cds from '@sap/cds';

import { OwnerModel } from '@/domain/models/db/owner';
import { OwnerRepository } from '@/domain/repositories';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY_NAME = 'db.models.Owners';

    public async findById(id: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult> {
        const ownerQuery = cds.ql.SELECT.one.from(this.ENTITY_NAME).where({ id });

        const owner = await cds.run(ownerQuery);

        if (!owner) {
            return null;
        }

        return OwnerModel.with({
            id: owner.id as string,
            firstName: owner.firstName as string,
            lastName: owner.lastName as string,
            phone: owner.phone as string,
            email: owner.email as string
        });
    }
}
