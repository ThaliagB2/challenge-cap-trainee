import { left, right } from '@sweet-monads/either';

import { ServerError } from '@/domain/errors/server';
import { PetModel } from '@/domain/models/db/pet';
import { AfterReadPetsUseCase } from '@/domain/use-cases/entity-events/pets';

export class AfterReadPetsUseCaseImpl implements AfterReadPetsUseCase {
    public execute(pets: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result {
        try {
            const petsWithAge = pets.map((pet) => {
                const petModel = PetModel.with(pet);

                return {
                    ...petModel.toObject(),
                    age: petModel.age
                };
            });

            return right(petsWithAge);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }
}
