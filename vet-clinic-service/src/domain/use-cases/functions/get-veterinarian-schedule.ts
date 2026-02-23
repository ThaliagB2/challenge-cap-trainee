import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentsModel } from '@/domain/models/db/appointments';

export interface getVeterinarianScheduleUsecase {
    execute(veterinarianId: string, days: number): Promise<getVeterinarianScheduleUsecase.Result>;
}

export namespace getVeterinarianScheduleUsecase {
    export type Result = Either<AbstractError, AppointmentsModel[]>;
}
