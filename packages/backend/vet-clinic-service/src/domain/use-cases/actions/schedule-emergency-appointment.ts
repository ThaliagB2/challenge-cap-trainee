import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentProps, EmergencyAppointmentParams } from '@/domain/models/db/appointment';

export interface ScheduleEmergencyAppointmentUseCase {
    execute(
        params: ScheduleEmergencyAppointmentUseCase.ScheduleEmergencyAppointmentUseCaseParams
    ): Promise<ScheduleEmergencyAppointmentUseCase.ScheduleEmergencyAppointmentUseCaseResult>;
}

export namespace ScheduleEmergencyAppointmentUseCase {
    export type ScheduleEmergencyAppointmentUseCaseParams = EmergencyAppointmentParams;
    export type ScheduleEmergencyAppointmentUseCaseResult = Either<AbstractError, AppointmentProps>;
}
