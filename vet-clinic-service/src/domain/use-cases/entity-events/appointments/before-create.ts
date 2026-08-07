import { Either } from "@sweet-monads/either"

import { AbstractError } from "@/domain/errors"
import { AppointmentForCreateProps, AppointmentProps } from "@/domain/models/db/appointment"

export interface BeforeCreateAppointmentUseCases {
    execute(params: BeforeCreateAppointmentUseCases.BeforeCreateParams): Promise <BeforeCreateAppointmentUseCases.BeforeCreateResult>
}

export namespace BeforeCreateAppointmentUseCases {
    export type BeforeCreateParams = Required<AppointmentForCreateProps>
    export type BeforeCreateResult = Either<AbstractError, AppointmentProps>
}