import { ServerError } from "@/domain/errors";
import { PetModel } from "@/domain/models/db/pet";
import { AfterReadPetsUseCase } from "@/domain/use-cases/entity-events/pets/after-read";
import { Pet } from "@models/db/models";
import { left, right } from "@sweet-monads/either";

export class AfterReadPetsUseCaseImpl implements AfterReadPetsUseCase{
    public execute(pets: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result {
        try {
            const petsWithAge = pets.map((pet: Pet) => {
                const petModel =  this.toModel(pet)
                return petModel.toFullObject();
            })
            return right(petsWithAge)
        } catch (error) {
           const errorData = error as Error;
           return left(new ServerError(errorData.message, errorData.stack));
        }
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