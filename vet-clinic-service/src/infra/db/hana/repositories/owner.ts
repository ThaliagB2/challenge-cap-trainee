import cds from '@sap/cds';

import { OwnerModel, OwnerProps } from '@/domain/models/db/owner';
import { OwnerRepository } from '@/domain/repositories';

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY = 'db.models.Owners';

    public async findAll(): Promise<OwnerRepository.FindAllResult> {
        const query = cds.ql.SELECT.from(this.ENTITY);
        const result: OwnerProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => OwnerModel.with(r));
    }

    public async findById(params: OwnerRepository.FindByIdParams): Promise<OwnerRepository.FindByIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ id: params.id });
        const result: OwnerProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => OwnerModel.with(r));
    }
}
