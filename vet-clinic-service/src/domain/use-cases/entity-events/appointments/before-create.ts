import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { AppointmentForCreateProps, AppointmentProps } from '@/domain/models/db/appointment';
import { PetModel } from '@/domain/models/db/pet';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export type PayloadResult = {
    hasError: boolean;
    errorMessage?: string;
    payload?: AppointmentProps;
    pet?: PetModel;
    veterinarian?: VeterinarianModel;
};

export interface BeforeCreateAppointmentUseCase {
    execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result>;
}

export namespace BeforeCreateAppointmentUseCase {
    export type Params = Required<AppointmentForCreateProps>;
    export type Result = Promise<Either<AbstractError, PayloadResult>>;
}
