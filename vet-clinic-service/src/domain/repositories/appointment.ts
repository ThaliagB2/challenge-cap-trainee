import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findByVeterinarianIdAndDate(params: AppointmentRepository.FindByVeterinarianIdAndDateParams): Promise<AppointmentRepository.FindByVeterinarianIdAndDateResult>;
    findByPetId(params: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult>;
    findByOwnerId(params: AppointmentRepository.FindByOwnerIdParams): Promise<AppointmentRepository.FindByOwnerIdResult>;
    bulkCreate(params: AppointmentRepository.BulkCreateParams): Promise<AppointmentRepository.BulkCreateResult>;
}

export namespace AppointmentRepository {
    export type FindByVeterinarianIdAndDateParams = {
        veterinarianId: string;
        dates: string[];
    };
    export type FindByPetIdParams = {
        petId: string;
    };
    export type FindByOwnerIdParams = {
        ownerId: string;
    };
    export type BulkCreateParams = {
        appointments: AppointmentModel[];
    };
    export type FindByVeterinarianIdAndDateResult = AppointmentModel[] | null;
    export type FindByPetIdResult = AppointmentModel[] | null;
    export type FindByOwnerIdResult = AppointmentModel[] | null;
    export type BulkCreateResult = void;
}
