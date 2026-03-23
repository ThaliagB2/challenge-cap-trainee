import cds from '@sap/cds';

import { OwnerModel, OwnerProps } from '@/domain/models/db/owner';
import { OwnerRepository } from '@/domain/repositories';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY = 'db.models.Owners';

    public async findById(params: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult> {
        const query = cds.ql.SELECT.one.from(this.ENTITY).where({ id: params.id });
        const result: OwnerProps = await cds.run(query);

        if (!result) {
            return null;
        }

        return OwnerModel.with(result);
    }
}
