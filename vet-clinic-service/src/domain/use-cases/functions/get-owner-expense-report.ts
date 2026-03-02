import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';
import { OwnerModel } from '@/domain/models/db/owner';

export type PayloadResult = {
    hasError: boolean;
    errorMessage?: string;
    report?: OwnerExpenseReportModel;
    owner?: OwnerModel;
};

export interface GetOwnerExpenseReportUseCase {
    execute(ownerId: string): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Result = Either<AbstractError, PayloadResult>;
}
