import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PurchaseOrderForCreateProps, PurchaseOrderProps } from '@/domain/models/db/purchase-order';

export interface BeforeCreatePurchaseOrderUseCase {
    execute(params: BeforeCreatePurchaseOrderUseCase.Params): Promise<BeforeCreatePurchaseOrderUseCase.Result>;
}

export namespace BeforeCreatePurchaseOrderUseCase {
    export type Params = Required<PurchaseOrderForCreateProps>;
    export type Result = Promise<Either<AbstractError, PurchaseOrderProps>>;
}
