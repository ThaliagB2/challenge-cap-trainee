import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { FullAppointmentProps } from '@/domain/models/db/appointment';

export interface GetVeterinarianSchedule {
    execute(): Promise<GetVeterinarianSchedule.Result>;
}

export namespace GetVeterinarianSchedule {
    export type Result = Either<AbstractError, FullAppointmentProps[]>;
}
