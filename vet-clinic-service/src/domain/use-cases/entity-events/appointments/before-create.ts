import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentProps } from '@/domain/models/db/appointment';

export interface BeforeCreateAppointmentUseCase {
    execute(params: BeforeCreateAppointmentUseCase.Params): BeforeCreateAppointmentUseCase.Result;
}

export namespace BeforeCreateAppointmentUseCase {
    export type Params = Required<AppointmentProps>;
    export type Result = Promise<Either<AbstractError, AppointmentProps>>;
}
