import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentsProps } from '@/domain/models/db/appointments';

export interface BeforeCreateAppointmentUseCase {
    execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result>;
}

export namespace BeforeCreateAppointmentUseCase {
    export type Params = Required<AppointmentsProps>;
    export type Result = Either<AbstractError, AppointmentsProps>;
}
