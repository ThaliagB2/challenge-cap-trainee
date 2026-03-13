import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { FullAppointmentProps } from '@/domain/models/db/appointment';
import { SearchVeterinarianScheduleParams } from '@/domain/models/db/veterinarian';

export interface GetVeterinarianScheduleUseCase {
    execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Params = SearchVeterinarianScheduleParams;
    export type Result = Either<AbstractError, FullAppointmentProps[]>;
}
