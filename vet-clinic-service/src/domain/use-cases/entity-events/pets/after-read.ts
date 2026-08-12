import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetProps } from '@/domain/models/db/pet';

export interface AfterReadPetsUseCase {
    execute(params: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result;
}

export namespace AfterReadPetsUseCase {
    export type Params = PetProps[];

    export type PetWithAge = PetProps & {
        age: number;
    };

    export type Result = Either<AbstractError, PetWithAge[]>;
}
