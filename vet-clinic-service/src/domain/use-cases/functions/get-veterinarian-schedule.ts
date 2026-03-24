import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { VeterinarianScheduleProps } from '@/domain/models/db/veterinarian-schedule';

export interface GetVeterinarianScheduleUseCase {
    execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Params = {
        veterinarian_id: string;
        days?: number;
    };
    export type Result = Either<AbstractError, VeterinarianScheduleProps[]>;
}
