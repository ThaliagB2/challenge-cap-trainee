import { left, right } from '@sweet-monads/either';

import { ServerError } from '@/domain/errors/server';
import { OwnerModel } from '@/domain/models/db/owner';
import { PetModel } from '@/domain/models/db/pet';
import { AfterReadPetsUseCase } from '@/domain/use-cases/entity-events/pets';

export class AfterReadPetsUseCaseImpl implements AfterReadPetsUseCase {
    public execute(pets: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result {
        try {
            const formattedPets = pets.map((pet) => this.toPetModel(pet));
            return right(formattedPets);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private toPetModel(pet: AfterReadPetsUseCase.Params[number]) {
        return PetModel.with({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            weight: pet.weight,
            birthDate: new Date(pet.birthDate),
            owner: OwnerModel.with({
                id: pet.owner.id,
                email: pet.owner.email,
                firstName: pet.owner.firstName,
                lastName: pet.owner.lastName,
                phone: pet.owner.phone,
                pets: []
            })
        }).toFullObject();
    }
}
