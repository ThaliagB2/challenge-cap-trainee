import cds from '@sap/cds';

import { PetModel } from '@/domain/models/db/pet';
import { PetRepository } from '@/domain/repositories';
import { Pet, Pets } from '@models/db/models';

export class PetRepositoryImpl implements PetRepository {
    private readonly ENTITY = 'db_models_Pets';

    public async findById(id: string): Promise<PetModel> {
        const petQuery = cds.ql.SELECT.from(this.ENTITY).where({ id });
        const [pet]: Pet[] = await cds.run(petQuery);
        if (!pet) {
            return null;
        }
        return PetModel.create({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            birthDate: new Date(pet.birthDate),
            weight: pet.weight,
            owner_id: pet.owner_id
        });
    }
    public async findByOwnerId(id: string): Promise<PetModel[]> {
        const petOwnerQuery = SELECT.from(this.ENTITY).where({ owner_id: id });
        const petOwner: Pets = await cds.run(petOwnerQuery);
        if (petOwner.length === 0) {
            return null;
        }
        return petOwner.map((pet) => {
            return PetModel.create({
                id: pet.id,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                birthDate: new Date(pet.birthDate),
                weight: pet.weight,
                owner_id: pet.owner_id
            });
        });
    }
}
