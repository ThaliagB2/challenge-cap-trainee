import { AbstractError } from '@/domain/errors';
import { FullAppointmentProps } from '@/domain/models/db/appointment';
import { Either } from '@sweet-monads/either';

export interface GetOwnerExpenseReport {
    execute(): Promise<GetOwnerExpenseReport.Result>;
}

export namespace GetOwnerExpenseReport {
    export type Result = Either<AbstractError, FullAppointmentProps[]>;
}
