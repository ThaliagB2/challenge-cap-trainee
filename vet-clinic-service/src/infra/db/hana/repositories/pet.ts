import cds from '@sap/cds';

import { PetRepository } from '@/domain/repositories';
import { PetModel, PetProps } from '@/domain/models/db/pet';

export class PetRepositoryImpl implements PetRepository {
    private readonly ENTITY = 'db_models_Pets';

    public async findById(id: string): Promise<PetModel> {
        const petQuery = SELECT.one.from(this.ENTITY).where({ id });
        const pet: PetProps = await cds.run(petQuery);
        if (!pet) {
            return null;
        }
        return PetModel.create({ ...pet });
    }
    public async findByOwnerId(id: string): Promise<PetModel[]> {
        const petOwnerQuery = SELECT.from(this.ENTITY).where({ owner_id: id });
        const petOwner: PetProps[] = await cds.run(petOwnerQuery);
        if (petOwner.length === 0) {
            return null;
        }
        return petOwner.map((pet) => {
            return PetModel.create({ ...pet });
        });
    }
}
