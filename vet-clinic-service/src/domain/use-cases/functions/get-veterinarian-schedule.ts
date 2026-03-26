import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/get-veterinarian-schedule';

export interface GetVeterinarianScheduleUseCase {
    execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Result = Either<AbstractError, VeterinarianScheduleModel[]>;
    export type Params = {
        veterinarianId: string;
        days?: number;
    };
}
