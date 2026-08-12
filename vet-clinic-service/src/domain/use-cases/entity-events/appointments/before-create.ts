import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentProps } from '@/domain/models/db/appointment';

export interface BeforeCreateAppointmentUseCase {
    execute(params: BeforeCreateAppointmentUseCase.Params): BeforeCreateAppointmentUseCase.Result;
}

export namespace BeforeCreateAppointmentUseCase {
    export type Params = Omit<AppointmentProps, 'status_id' | 'totalCost'> & { status_id?: string; totalCost?: number };
    export type Result = Promise<Either<AbstractError, AppointmentProps>>;
}
