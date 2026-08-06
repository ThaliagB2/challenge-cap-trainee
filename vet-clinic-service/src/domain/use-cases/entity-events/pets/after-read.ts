import { Either } from '@sweet-monads/either';

import { Pets } from '@models/db/models';

import { AbstractError } from '@/domain/errors';
import { PetProps } from '@/domain/models/db/pet';

export interface AfterReadPetsUseCase {
    execute(params: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result;
}

export namespace AfterReadPetsUseCase {
    export type Params = Pets;
    export type Result = Either<AbstractError, PetProps[]>;
}
