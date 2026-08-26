import type { Either } from '@sweet-monads/either';

import type { AbstractError } from '@/domain/errors/abstract.js';
import type { BaseController, BaseControllerState } from '@/presentation/controllers/base/protocols.js';

export abstract class BaseControllerImpl implements BaseController {
    public handleResult<T>(result: Either<AbstractError, T>): BaseControllerState<T> {
        if (result.isLeft()) {
            return { data: null, error: result.value };
        }
        return { data: result.value, error: null };
    }
}
