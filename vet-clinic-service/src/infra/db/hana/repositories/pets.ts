import cds from '@sap/cds';

import { Pets } from '@models/db/models';

import { PetsModel } from '@/domain/models/db/pets';
import { petsRepository } from '@/domain/repositories';

export class PetsRepositoryImpl implements petsRepository {
    async findPetsById(id: string): Promise<PetsModel | null> {
        const petQuerry = cds.ql.SELECT.from('db.models.Pets').where({ id });
        const pets = await cds.run(petQuerry);
        if (!pets || pets.length === 0) {
            return null;
        }
        const pet = pets[0];
        return PetsModel.create({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            birthDate: pet.birthDate,
            breed: pet.breed,
            weight: pet.weight,
            owner_id: pet.owner_id
        });
    }

    async findOwnersById(id: string): Promise<PetsModel[]> {
        const petOwnerQuerry = await cds.ql.SELECT.from('pets').where({ owner_id: id });
        const petOwner: Pets = await cds.run(petOwnerQuerry);
        return petOwner.map((pet) => {
            return PetsModel.create({
                id: pet.id,
                name: pet.name,
                species: pet.species,
                birthDate: new Date(pet.birthDate),
                breed: pet.breed,
                weight: pet.weight,
                owner_id: pet.owner_id
            });
        });
    }
}
