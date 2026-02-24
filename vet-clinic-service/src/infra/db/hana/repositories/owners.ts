import cds from '@sap/cds';

import { OwnersModel } from '@/domain/models/db/owners';
import { ownersRepository } from '@/domain/repositories';

export class OwnersRepositoryImpl implements ownersRepository {
    async findOwnersById(id: string): Promise<OwnersModel> {
        const ownerQuerry = await cds.ql.SELECT.from('owners').where({ id });
        const owner = await cds.run(ownerQuerry);
        if (!owner.length) {
            throw new Error(`Owner with id ${id} not found`);
        }
        return OwnersModel.create({
            id: owner[0].id,
            firstName: owner[0].firstName,
            lastName: owner[0].lastName,
            phone: owner[0].phone,
            email: owner[0].email
        });
    }
}
