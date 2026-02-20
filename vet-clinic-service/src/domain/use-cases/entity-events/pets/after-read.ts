import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetForCreateProps, PetWithAgeProps } from '@/domain/models/db/pet';

export interface AfterReadPetUseCase {
    execute(params: AfterReadPetUseCase.Params): Promise<AfterReadPetUseCase.Result>;
}

export namespace AfterReadPetUseCase {
    export type Params = Required<PetForCreateProps>[];
    export type Result = Promise<Either<AbstractError, PetWithAgeProps[]>>;
}
