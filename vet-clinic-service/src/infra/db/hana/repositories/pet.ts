import { PetModel } from "@/domain/models/db/pet";
import { PetRepository } from "@/domain/repositories/pet";
import { Pet } from "@models/db/models";
import cds from "@sap/cds";

export class PetRepositoryImpl implements PetRepository {
    private readonly ENTITY_NAME = 'db.models.Pets';

    public async findById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindByIdResult | null> {
        const pet = await cds.ql.SELECT.one.from(this.ENTITY_NAME).where({ id })
        if(!pet){
            return null
        }
        return this.toModel(pet)
    }

    public async findByOwnerId(onwerId: PetRepository.FindByOwnerIdParams): Promise<PetRepository.FindByOwnerIdResult | null> {
        const petsQuery = cds.ql.SELECT.from(this.ENTITY_NAME).where({ owner_id: { in: onwerId } });
        const pets = await cds.run(petsQuery)
        if(pets.length == 0){
            return null
        }
        return pets.map((pet: Pet) => this.toModel(pet))

    }

    private toModel (pet: Pet): PetModel {
        return PetModel.with ({
            id: pet.id as string,
            name: pet.name as string,
            species: pet.species as string,
            breed: pet.breed as string,
            birthDate: pet.birthDate as string,
            weight: pet.weight as number,
            owner_id: pet.owner_id as string
        })
    }
}