import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetProps } from '@/domain/models/db/pet';
import { Pets } from '@models/db/models';

export interface AfterReadPetsUseCase {
    execute(params: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result;
}

export namespace AfterReadPetsUseCase {
    export type Params = Pets;
    export type Result = Promise<Either<AbstractError, PetProps[]>>;
}
