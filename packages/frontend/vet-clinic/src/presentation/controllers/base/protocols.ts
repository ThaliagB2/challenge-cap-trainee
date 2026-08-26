import type { Either } from '@sweet-monads/either';

import type { AbstractError } from '@/domain/errors/abstract.js';

export interface BaseController {
    handleResult<T>(result: Either<AbstractError, T>): BaseControllerState<T>;
}

export type BaseControllerState<T> = {
    data: T | null;
    error: AbstractError | null;
}
