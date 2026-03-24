import { AppointmentsModel } from '../models/db/appointments';

export interface AppointmentsRepository {
    findPetById(petId: AppointmentsRepository.FindPetByIdParams): Promise<AppointmentsRepository.Result>;
    create(appointment: AppointmentsRepository.CreateParams): Promise<AppointmentsRepository.CreateResult>;
    findVetIdandDate(params: AppointmentsRepository.FindVetIdandDateParams): Promise<AppointmentsRepository.Result>;
    findByOwnerIdAndStatus(params: AppointmentsRepository.FindByOwnerIdAndStatusParams): Promise<AppointmentsRepository.Result>;
}

export namespace AppointmentsRepository {
    export type Result = AppointmentsModel[];
    export type CreateResult = void;
    export type FindPetByIdParams = string;
    export type CreateParams = AppointmentsModel[];
    export type FindVetIdandDateParams = {
        vetId: string;
        dates: string[];
    };
    export type FindByOwnerIdAndStatusParams = {
        ownerId: string;
        status: string;
    };
}
