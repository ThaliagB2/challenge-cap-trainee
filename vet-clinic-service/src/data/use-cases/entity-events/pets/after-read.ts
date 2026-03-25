import { left, right } from '@sweet-monads/either';

import { AfterReadPetsUseCase } from '@/domain/use-cases/entity-events/pets';
import { NotFoundError } from '@/domain/errors';
import { PetModel } from '@/domain/models/db/pet';
import { ServerError } from '@/domain/errors/server';

export class AfterReadPetsUseCaseImpl implements AfterReadPetsUseCase {
    public execute(params: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result {
        try {
            if (params.length === 0) {
                return left(new NotFoundError('petsNotFound'));
            }

            const petModel = params.map((pet) => PetModel.with(pet).toFullObject());
            return right(petModel);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }
}
