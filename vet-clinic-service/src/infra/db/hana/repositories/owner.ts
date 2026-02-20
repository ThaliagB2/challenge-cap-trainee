import cds from '@sap/cds';

import { OwnerModel } from '@/domain/models/db/owner';
import { OwnerRepository } from '@/domain/repositories';
import { Owners } from '@models/db/models';

export class OwnerRepositoryImpl implements OwnerRepository {
    async findById(id: string): Promise<OwnerModel> {
        const ownerQuery = cds.ql.SELECT.from('Owners').where({ id });
        const owner: Owners = await cds.run(ownerQuery);
        if (owner.length === 0) {
            return null;
        }
        return OwnerModel.create({ id: owner[0].id, firstName: owner[0].firstName, lastName: owner[0].lastName, phone: owner[0].phone, email: owner[0].email });
    }
}
