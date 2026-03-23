import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReportProps } from '@/domain/models/db/owner-expense-report';

export interface GetOwnerExpenseReportUseCase {
    execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Params = {
        owner_id: string;
    };
    export type Result = Either<AbstractError, OwnerExpenseReportProps>;
}
