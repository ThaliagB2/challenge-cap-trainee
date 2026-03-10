import cds from '@sap/cds';

import { OwnerModel } from '@/domain/models/db/owner';
import { PetModel } from '@/domain/models/db/pet';
import { PetRepository } from '@/domain/repositories';
import { Pets } from '@models/db/models';

export class PetRepositoryImpl implements PetRepository {
    private readonly PET = 'db.models.Pets';

    public async findAll(): Promise<PetModel[]> {
        const petsQuery = cds.ql.SELECT.from(this.PET);
        const pets: Pets = await cds.run(petsQuery);

        if (pets.length === 0) return null;

        return pets.map((pet) =>
            PetModel.with({
                id: pet.id as string,
                name: pet.name as string,
                species: pet.species as string,
                breed: pet.breed as string,
                birthDate: pet.birthDate as unknown as Date,
                weight: pet.weight as number,
                owner: pet.owner as unknown as OwnerModel
            })
        );
    }

    public async findById(ids: string[]): Promise<PetModel[]> {
        const petsQuery = cds.ql.SELECT.from(this.PET).where({ id: { in: ids } });
        const pets: Pets = await cds.run(petsQuery);

        if (pets.length === 0) return null;

        return pets.map((pet) =>
            PetModel.with({
                id: pet.id as string,
                name: pet.name as string,
                species: pet.species as string,
                breed: pet.breed as string,
                birthDate: pet.birthDate as unknown as Date,
                weight: pet.weight as number,
                owner: pet.owner as unknown as OwnerModel
            })
        );
    }

    public async findByOwnerId(id: string): Promise<PetModel[]> {
        const petsQuery = cds.ql.SELECT.from(this.PET).where({ owner_ID: id });
        const pets: Pets = await cds.run(petsQuery);

        if (pets.length === 0) return null;

        return pets.map((pet) =>
            PetModel.with({
                id: pet.id as string,
                name: pet.name as string,
                species: pet.species as string,
                breed: pet.breed as string,
                birthDate: pet.birthDate as unknown as Date,
                weight: pet.weight as number,
                owner: pet.owner as unknown as OwnerModel
            })
        );
    }
}
