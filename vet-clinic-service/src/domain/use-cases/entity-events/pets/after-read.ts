import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetsAgeProps, PetsProps } from '@/domain/models/db/pets';

export interface AfterReadPetUseCase {
    execute(params: AfterReadPetUseCase.Params): Promise<AfterReadPetUseCase.Result>;
}

export namespace AfterReadPetUseCase {
    export type Params = PetsProps[];
    export type Result = Either<AbstractError, PetsAgeProps[]>;
}
