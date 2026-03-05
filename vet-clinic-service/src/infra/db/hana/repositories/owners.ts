import cds from '@sap/cds';

import { OwnersModel } from '@/domain/models/db/owners';
import { ownersRepository } from '@/domain/repositories';

export class OwnersRepositoryImpl implements ownersRepository {
    public async findOwnersById(id: string): Promise<OwnersModel> {
        const ownerQuerry = await cds.ql.SELECT.from('owners').where({ id });
        const owner = await cds.run(ownerQuerry);
        return OwnersModel.create({
            //refatorado
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            phone: owner.phone,
            email: owner.email
        });
    }
}
