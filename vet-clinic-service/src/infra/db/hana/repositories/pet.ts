import cds from '@sap/cds';

import { PetModel } from '@/domain/models/db/pet';
import { PetRepository } from '@/domain/repositories';
import { Pets } from '@models/db/models';

export class PetRepositoryImpl implements PetRepository {
    async findById(id: string): Promise<PetModel> {
        const petQuery = cds.ql.SELECT.from('Pets').where({ id });
        const pet = await cds.run(petQuery);
        if (pet.length === 0) {
            return null;
        }
        return PetModel.create({
            id: pet[0].id,
            name: pet[0].name,
            species: pet[0].species,
            breed: pet[0].breed,
            birthDate: pet[0].birthDate,
            weight: pet[0].weight,
            owner_id: pet[0].owner_id
        });
    }
    async findByOwnerId(id: string): Promise<PetModel[]> {
        const petOwnerQuery = SELECT.from('Pets').where({ owner_id: id });
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
