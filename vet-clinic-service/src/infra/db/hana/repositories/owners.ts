import cds from '@sap/cds';

import { OwnersModel } from '@/domain/models/db/owners';
import { OwnersRepository, OwnerRepository } from '@/domain/repositories';

export class OwnersRepositoryImpl implements OwnersRepository {
    private readonly ENTITY = 'db.models.Owners';
    //refatorado
    public async findOwnersById(id: OwnerRepository.FindByIParams): Promise<OwnerRepository.FindByIdResult> {
        const ownerQuerry = cds.ql.SELECT.from(this.ENTITY).where({ id });
        const owner = await cds.run(ownerQuerry);
        return OwnersModel.create({
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            phone: owner.phone,
            email: owner.email
        });
    }
}
