import cds from '@sap/cds';

import { Owner } from '@models/db/models';
import { OwnerModel } from '@/domain/models/db/owner';
import { OwnerRepository } from '@/domain/repositories';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY = 'db_models_Owners';

    public async findById(id: string): Promise<OwnerModel> {
        const ownerQuery = cds.ql.SELECT.from(this.ENTITY).where({ id });
        const [owner]: Owner[] = await cds.run(ownerQuery);
        if (!owner) {
            return null;
        }
        return OwnerModel.create({ id: owner.id, firstName: owner.firstName, lastName: owner.lastName, phone: owner.phone, email: owner.email });
    }
}
