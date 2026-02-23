import { AbstractError } from '@/domain/errors';
import { Either } from '@sweet-monads/either';
import { EmergencyAppointmentProps } from '@/domain/models/db/appointments';

export interface scheduleEmergencyAppointmentUsecase {
    execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result>;
}

export namespace ScheduleEmergencyAppointmentUseCase {
    export type Params = EmergencyAppointmentProps;
    export type Result = Either<AbstractError, void>;
}
