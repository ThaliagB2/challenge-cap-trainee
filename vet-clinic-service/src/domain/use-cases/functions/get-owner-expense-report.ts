import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';

export interface GetOwnerExpenseReportUseCase {
    execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result>;
}

export namespace GetOwnerExpenseReportUseCase {
    export type Params = {
        owner_id: string;
    };
    export type Result = Either<AbstractError, AppointmentModel>;
}
