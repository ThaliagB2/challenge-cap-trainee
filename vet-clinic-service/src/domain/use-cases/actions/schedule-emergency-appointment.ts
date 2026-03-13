import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { EmergencyAppointmentProps } from '@/domain/models/db/appointments';
import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { PetsModel } from '@/domain/models/db/pets';

export interface ScheduleEmergencyAppointmentUsecase {
    execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result>;
}
export type ResultPayload = {
    hasError: boolean;
    errorMessage?: string;
    appointmentId?: string;
    vet?: VeterinariansModel;
    pet?: PetsModel;
};
export namespace ScheduleEmergencyAppointmentUseCase {
    export type Params = EmergencyAppointmentProps;
    export type Result = Either<AbstractError, void | { appointment: string }>;
}
