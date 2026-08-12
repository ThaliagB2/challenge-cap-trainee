import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';

export interface GetOwnerExpenseReportUseCase {
    execute(params: GetOwnerExpenseReportUseCase.Params): GetOwnerExpenseReportUseCase.Result;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Params = {
        ownerId: string;
    };

    export type ExpenseReport = {
        ownerId: string;
        ownerName: string;
        totalExpenses: number;
        appointmentCount: number;
        averageCost: number;
    };

    export type Result = Promise<Either<AbstractError, ExpenseReport>>;
}
