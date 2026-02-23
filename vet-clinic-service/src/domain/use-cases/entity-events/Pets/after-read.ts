import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetsAgeProps, PetsCreatePropsId } from '@/domain/models/db/pets';

export interface afterReadPetUsecase {
    execute(params: AfterReadPetUseCase.Params): Promise<AfterReadPetUseCase.Result>;
}

export namespace AfterReadPetUseCase {
    export type Params = Required<PetsCreatePropsId>;
    export type Result = Promise<Either<AbstractError, PetsAgeProps>>;
}
