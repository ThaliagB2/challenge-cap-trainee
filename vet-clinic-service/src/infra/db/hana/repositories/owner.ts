import cds from '@sap/cds';

import { OwnerRepository } from '@/domain/repositories';
import { OwnerModel, OwnerProps } from '@/domain/models/db/owner';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY = 'db.models.Owners';

    public async findById(params: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult> {
        const query = cds.ql.SELECT.one
            .from(this.ENTITY)
            .columns(...(['*', { ref: ['pets'], expand: ['*'] }] as any[]))
            .where({ id: params.id });
        const result: OwnerProps = await cds.run(query);

        if (!result) {
            return null;
        }

        return OwnerModel.with(result);
    }
}
