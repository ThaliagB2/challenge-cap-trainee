import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { PetProps } from '@/domain/models/db/pet';
import { ProcedureProps } from '@/domain/models/db/procedure';
import { VeterinarianProps } from '@/domain/models/db/veterinarian';

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
}
