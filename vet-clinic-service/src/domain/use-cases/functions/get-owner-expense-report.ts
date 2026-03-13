import { AbstractError } from '@/domain/errors';
import { OwnerExpenseReport } from '@/domain/models/db/appointment';
import { Either } from '@sweet-monads/either';

export interface GetOwnerExpenseReportUseCase {
    execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Params = string;
    export type Result = Either<AbstractError, OwnerExpenseReport>;
}
