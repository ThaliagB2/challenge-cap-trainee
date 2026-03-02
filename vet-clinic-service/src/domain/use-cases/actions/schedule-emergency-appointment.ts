import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { EmergencyAppointmentProps } from '@/domain/models/db/appointment';
import { PetModel } from '@/domain/models/db/pet';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export type PayloadResult = {
    hasError: boolean;
    errorMessage?: string;
    appointmentId?: string;
    pet?: PetModel;
    veterinarian?: VeterinarianModel;
};

export interface ScheduleEmergencyAppointmentUseCase {
    execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result>;
}

export namespace ScheduleEmergencyAppointmentUseCase {
    export type Params = EmergencyAppointmentProps;
    export type Result = Promise<Either<AbstractError, PayloadResult>>;
}
