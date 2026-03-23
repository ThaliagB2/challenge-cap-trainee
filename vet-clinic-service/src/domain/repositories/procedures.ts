import { ProceduresModel } from '../models/db/procedures';

export interface ProceduresRepository {
    create(procedures: ProcedureRepository.CreateParams): Promise<ProcedureRepository.CreateResult>;
    findByAppointmentId(appointmentId: ProcedureRepository.FindByAppointmentIdParams): Promise<ProcedureRepository.FindByAppointmentIdResult>;
}

export namespace ProcedureRepository {
    export type CreateParams = ProceduresModel[];
    export type CreateResult = void;
    export type FindByAppointmentIdParams = string;
    export type FindByAppointmentIdResult = ProceduresModel[];
}
