import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';

export interface GetOwnerExpenseReportUseCase {
    execute(ownerId: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Params = string;
    export type Result = Either<AbstractError, OwnerExpenseReportModel>;
}
