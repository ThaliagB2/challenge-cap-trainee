import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';

export interface GetVeterinarianScheduleUseCase {
    execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Params = {
        veterinarian_id: string;
        days?: number;
    };
    export type Result = Either<AbstractError, Promise<AppointmentModel[]>>;
}
