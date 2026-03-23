import { ProcedureModel } from '@/domain/models/db/procedure';

export interface ProcedureRepository {
    create(procedure: ProcedureRepository.CreateParams): Promise<ProcedureRepository.CreateResult>;
    findByAppointmentId(appointmentId: ProcedureRepository.FindByAppointmentIdParams): Promise<ProcedureRepository.FindByAppointmentIdResult>;
}

export namespace ProcedureRepository {
    export type CreateParams = ProcedureModel[];
    export type CreateResult = void;
    export type FindByAppointmentIdParams = string;
    export type FindByAppointmentIdResult = ProcedureModel[];
}
