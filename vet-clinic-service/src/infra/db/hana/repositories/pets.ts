import cds from '@sap/cds';

import { Pets } from '@models/db/models';

import { PetsModel } from '@/domain/models/db/pets';
import { petsRepository } from '@/domain/repositories';

export class PetsRepositoryImpl implements petsRepository {
    async findPetsById(id: string): Promise<PetsModel> {
        const petQuerry = await cds.ql.SELECT.from('pets').where({ id });
        const pet = await cds.run(petQuerry);
        if (!pet.length) {
            throw new Error(`Pet with id ${id} not found`);
        }
        return PetsModel.create({
            //rafatorar para tirar [0]
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
