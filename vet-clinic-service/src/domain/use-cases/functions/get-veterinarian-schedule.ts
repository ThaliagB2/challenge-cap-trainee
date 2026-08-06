import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentProps } from '@/domain/models/db/appointment';
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
}
