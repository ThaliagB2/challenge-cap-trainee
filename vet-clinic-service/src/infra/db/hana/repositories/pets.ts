import cds from '@sap/cds';

import { PetsModel, PetsProps } from '@/domain/models/db/pets';
import { PetsRepository, PetRepository } from '@/domain/repositories';
//variavel global
export class PetsRepositoryImpl implements PetsRepository {
    private readonly ENTITY = 'db.models.Pets';
    // refatorado
    public async findPetsById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindPetsByIdResult> {
        const petQuerry = cds.ql.SELECT.from(this.ENTITY).where({ id });
        const pet: PetsProps = await cds.run(petQuerry);
        if (!pet) {
            return null;
        }
        return PetsModel.create({
            ...pet
        });
    }

    public async findOwnersById(id: PetRepository.FindByIdParams): Promise<PetRepository.FindOwnersByIdResult> {
        const petOwnerQuerry = await cds.ql.SELECT.from('pets').where({ owner_id: id });
        const petOwner: PetsProps[] = await cds.run(petOwnerQuerry);
        return petOwner.map((pet) => {
            return PetsModel.create({ ...pet });
        });
    }
}
