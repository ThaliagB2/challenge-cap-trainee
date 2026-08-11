import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReportProps } from '@/domain/models/db/owner';

export interface GetOwnerExpenseReportUseCase {
    execute(owner_id: GetOwnerExpenseReportUseCase.GetOwnerExpenseReportUseCasParams): Promise<GetOwnerExpenseReportUseCase.GetOwnerExpenseReportUseCasResult>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type GetOwnerExpenseReportUseCasParams = string;
    export type GetOwnerExpenseReportUseCasResult = Either<AbstractError, OwnerExpenseReportProps>;
}
