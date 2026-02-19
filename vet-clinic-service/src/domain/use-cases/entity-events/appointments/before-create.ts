import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentForCreateProps, AppointmentProps } from '@/domain/models/db/appointment';

export interface BeforeCreateAppointmentUseCase {
    execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result>;
}

export namespace BeforeCreateAppointmentUseCase {
    export type Params = Required<AppointmentForCreateProps>;
    export type Result = Promise<Either<AbstractError, AppointmentProps>>;
}
