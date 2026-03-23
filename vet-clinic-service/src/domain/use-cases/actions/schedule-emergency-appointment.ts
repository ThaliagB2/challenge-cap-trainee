import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentForCreateProps } from '@/domain/models/db/appointment';

export interface ScheduleEmergencyAppointmentUseCase {
    execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result>;
}

export namespace ScheduleEmergencyAppointmentUseCase {
    export type Params = AppointmentForCreateProps;
    export type Result = Promise<Either<AbstractError, string>>;
}
