import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetProps, PetWithAgeProps } from '@/domain/models/db/pet';

export interface AfterReadPetUseCase {
    execute(params: AfterReadPetUseCase.Params): Promise<AfterReadPetUseCase.Result>;
}

export namespace AfterReadPetUseCase {
    export type Params = PetProps[];
    export type Result = Either<AbstractError, PetWithAgeProps[]>;
}
