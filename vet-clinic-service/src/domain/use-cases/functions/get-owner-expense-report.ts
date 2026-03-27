import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReport } from '@/domain/models/db/get-owner-expense-report';

export interface GetOwnerExpenseReportUseCase {
    execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Result = Either<AbstractError, OwnerExpenseReport>;
    export type Params = { ownerId: string };
}
