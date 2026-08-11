import cds from '@sap/cds';

import { PetModel, PetProps } from '@/domain/models/db/pet';
import { PetRepository } from '@/domain/repositories';

export class PetRepositoryImpl implements PetRepository {
    private readonly ENTITY_NAME = 'db.models.Pets';

    public async findById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindByIdResult> {
        const petQuery = cds.ql.SELECT.one.from(this.ENTITY_NAME).where({ id });

        const pet = await cds.run(petQuery);

        if (!pet) {
            return null;
        }

        return PetModel.with({
            id: pet.id as string,
            name: pet.name as string,
            species: pet.species as string,
            breed: pet.breed as string,
            birthDate: pet.birthDate as string,
            weight: pet.weight as number,
            owner_id: pet.owner_id as string
        });
    }

    public async findByOwnerId(ownerId: PetRepository.FindByOwnerIdParams): Promise<PetRepository.FindByOwnerIdResult> {
        const petsQuery = cds.ql.SELECT.from(this.ENTITY_NAME).where({ owner_id: ownerId });

        const pets = (await cds.run(petsQuery)) as PetProps[];

        return pets.map((pet) =>
            PetModel.with({
                id: pet.id as string,
                name: pet.name as string,
                species: pet.species as string,
                breed: pet.breed as string,
                birthDate: pet.birthDate as string,
                weight: pet.weight as number,
                owner_id: pet.owner_id as string
            })
        );
    }
}
