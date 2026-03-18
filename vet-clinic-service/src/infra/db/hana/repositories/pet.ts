import cds from '@sap/cds';

import { PetModel, PetProps } from '@/domain/models/db/pet';
import { PetRepository } from '@/domain/repositories';

export class PetRepositoryImpl implements PetRepository {
    private readonly ENTITY = 'db.models.Pets';

    public async findAll(): Promise<PetRepository.FindAllResult> {
        const query = cds.ql.SELECT.from(this.ENTITY);
        const result: PetProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => PetModel.with(r));
    }

    public async findById(params: PetRepository.FindByIdParams): Promise<PetRepository.FindByIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ id: params.id });
        const result: PetProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => PetModel.with(r));
    }

    public async findByOwnerId(params: PetRepository.FindByOwnerIdParams): Promise<PetRepository.FindByOwnerIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ owner_id: params.ownerId });
        const result: PetProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => PetModel.with(r));
    }
}
