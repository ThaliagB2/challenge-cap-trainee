import { Either } from '@sweet-monads/either';

import { Products } from '@models/db/models';

import { AbstractError } from '@/domain/errors';
import { FullProductProps } from '@/domain/models/db/product';

export interface AfterReadProductsUseCase {
    execute(params: AfterReadProductsUseCase.Params): AfterReadProductsUseCase.Result;
}

export namespace AfterReadProductsUseCase {
    export type Params = Products;
    export type Result = Either<AbstractError, FullProductProps[]>;
}
