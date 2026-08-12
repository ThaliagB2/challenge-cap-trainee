import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';
import { OwnerProps } from '@/domain/models/db/owner';
import { PetProps } from '@/domain/models/db/pet';

export interface GetVeterinarianScheduleUseCase {
    execute(params: GetVeterinarianScheduleUseCase.Params): GetVeterinarianScheduleUseCase.Result;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Params = {
        veterinarianId: string;
        days?: number;
    };

    export type ScheduleItem = AppointmentProps & {
        pet: PetProps & {
            owner: OwnerProps;
        };
    };

    export type Result = Promise<Either<AbstractError, ScheduleItem[]>>;

    export type ValidateVeterinarianParams = string;
    export type ValidateVeterinarianResult = Promise<void>;

    export type GetAppointmentsParams = Params;
    export type GetAppointmentsResult = Promise<AppointmentModel[]>;

    export type CreateScheduleItemParams = AppointmentModel;
    export type CreateScheduleItemResult = Promise<ScheduleItem>;
}
