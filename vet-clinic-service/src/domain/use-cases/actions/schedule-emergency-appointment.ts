import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetModel, PetProps } from '@/domain/models/db/pet';
import { ProcedureModel, ProcedureProps } from '@/domain/models/db/procedure';
import { VeterinarianModel, VeterinarianProps } from '@/domain/models/db/veterinarian';
import { AppointmentModel } from '@/domain/models/db/appointment';

export interface ScheduleEmergencyAppointmentUseCase {
    execute(params: ScheduleEmergencyAppointmentUseCase.Params): ScheduleEmergencyAppointmentUseCase.Result;
}

export namespace ScheduleEmergencyAppointmentUseCase {
    export type EmergencyProcedureInput = {
        description: string;
        cost: number;
    };

    export type Params = {
        petId: string;
        veterinarianId: string;
        notes: string;
        procedure: EmergencyProcedureInput[];
    };

    export type EmergencyAppointmentResult = {
        id: string;
        date: string;
        status: string;
        isEmergency: boolean;
        totalCost: number;
        notes: string;
        pet: PetProps;
        procedures: ProcedureProps[];
        veterinarian: VeterinarianProps;
    };

    export type Result = Promise<Either<AbstractError, EmergencyAppointmentResult>>;
    export type CreateProceduresParams = {
        procedures: EmergencyProcedureInput[];
        appointmentId: string;
    };

    export type CreateProceduresResult = ProcedureModel[];

    export type CreateAppointmentParams = {
        params: Params;
        appointmentId: string;
        procedures: ProcedureModel[];
    };

    export type CreateAppointmentResult = AppointmentModel;

    export type CreateResultParams = {
        appointment: AppointmentModel;
        pet: PetModel;
        veterinarian: VeterinarianModel;
        procedures: ProcedureModel[];
    };

    export type CreateResultResult = EmergencyAppointmentResult;

    export type SaveProceduresParams = ProcedureModel[];
    export type SaveProceduresResult = Promise<void>;
    export type ValidatePetParams = string;
    export type ValidatePetResult = Promise<PetModel>;

    export type ValidateVeterinarianParams = string;
    export type ValidateVeterinarianResult = Promise<VeterinarianModel>;

    export type ValidateProceduresParams = EmergencyProcedureInput[];
    export type ValidateProceduresResult = void;
}
