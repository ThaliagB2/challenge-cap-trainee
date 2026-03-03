import cds from '@sap/cds';

import { OwnerRepository } from '@/domain/repositories';
import { OwnerModel, OwnerProps } from '@/domain/models/db/owner';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY = 'db_models_Owners';

    public async findById(id: string): Promise<OwnerModel> {
        const ownerQuery = SELECT.one.from(this.ENTITY).where({ id });
        const owner: OwnerProps = await cds.run(ownerQuery);
        if (!owner) {
            return null;
        }
        return OwnerModel.create({ ...owner });
    }
}
