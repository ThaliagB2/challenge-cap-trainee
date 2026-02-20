import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';

export interface GetOwnerExpenseReportUseCase {
    execute(ownerId: string): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Result = Either<AbstractError, [string, string, number, number, number]>;
}
