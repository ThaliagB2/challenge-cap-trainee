import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { ScheduleVeterinarianAppointmentProps } from '@/domain/models/db/appointment';

export interface GetVeterinarianScheduleItemUseCase {
    execute(
        params: GetVeterinarianScheduleItemUseCase.GetVeterinarianScheduleItemUseCaseParams
    ): Promise<GetVeterinarianScheduleItemUseCase.GetVeterinarianScheduleItemUseCaseResult>;
}

export namespace GetVeterinarianScheduleItemUseCase {
    export type GetVeterinarianScheduleItemUseCaseParams = { veterinarian_id: string; days: number };
    export type GetVeterinarianScheduleItemUseCaseResult = Either<AbstractError, ScheduleVeterinarianAppointmentProps[]> | null;
}
