import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PurchaseOrderForCreateProps } from '@/domain/models/db/purchase-order';

export interface BulkCreatePurchaseOrdersUseCase {
    execute(params: BulkCreatePurchaseOrdersUseCase.Params): Promise<BulkCreatePurchaseOrdersUseCase.Result>;
}

export namespace BulkCreatePurchaseOrdersUseCase {
    export type Params = PurchaseOrderForCreateProps[];
    export type Result = Promise<Either<AbstractError, string>>;
}
