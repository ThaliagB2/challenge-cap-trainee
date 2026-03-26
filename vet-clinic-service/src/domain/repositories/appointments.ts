import { AppointmentsModel } from '../models/db/appointments';

export interface AppointmentsRepository {
    findPetById(petId: AppointmentsRepository.FindPetByIdAndOwnerParams): Promise<AppointmentsRepository.Result>;
    create(appointment: AppointmentsRepository.CreateParams): Promise<AppointmentsRepository.CreateResult>;
    findVetIdandDate(params: AppointmentsRepository.FindVetIdandDateParams): Promise<AppointmentsRepository.Result>;
    findPetsByOwnerId(params: AppointmentsRepository.FindPetByIdAndOwnerParams): Promise<AppointmentsRepository.PetIdsResult>;
    findByPetIdsAndStatus(petIds: string[], status: string): Promise<AppointmentsRepository.Result>;
    findByOwnerIdAndStatus(params: AppointmentsRepository.FindByOwnerIdAndStatusParams): Promise<AppointmentsRepository.Result>;
}

export namespace AppointmentsRepository {
    export type Result = AppointmentsModel[];
    export type CreateResult = void;
    export type FindPetByIdAndOwnerParams = string;
    export type CreateParams = AppointmentsModel[];
    export type FindVetIdandDateParams = {
        vetId: string;
        dates: string[];
    };
    export type FindByOwnerIdAndStatusParams = {
        ownerId: string;
        status: string;
    };
    export type PetIdsResult = string[];
}
