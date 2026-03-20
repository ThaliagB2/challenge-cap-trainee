import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';

export interface GetVeterinarianScheduleUseCase {
    execute(veterinarianId: string, days: number): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Result = Either<AbstractError, VeterinarianScheduleModel[]>;
}
