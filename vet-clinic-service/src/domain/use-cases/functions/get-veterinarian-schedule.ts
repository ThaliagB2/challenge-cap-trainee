import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';

export interface GetVeterinarianScheduleUseCase {
    execute(veterinarianId: string, days: number): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Result = Either<AbstractError, AppointmentModel[]>;
}
