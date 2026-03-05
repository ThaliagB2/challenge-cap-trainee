import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { appointmentsProps } from '@/domain/models/db/appointments';

export interface BeforeCreateAppointmentUseCase {
    execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result>;
}

export namespace BeforeCreateAppointmentUseCase {
    export type Params = Required<appointmentsProps>;
    export type Result = Promise<Either<AbstractError, appointmentsProps>>;
}
