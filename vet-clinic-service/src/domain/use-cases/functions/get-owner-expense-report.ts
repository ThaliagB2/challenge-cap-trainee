import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReport } from '@/domain/models/db/owners';

export interface getOwnerExpenseReportUsecase {
    execute(ownerId: string): Promise<getOwnerExpenseReportUsecase.Result>;
}

export namespace getOwnerExpenseReportUsecase {
    export type Result = Either<AbstractError, OwnerExpenseReport>;
}
