import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findAll(): Promise<AppointmentRepository.FindAllResult>;
    findByVeterinarianIdAndDate(params: AppointmentRepository.FindByVeterinarianIdAndDateParams): Promise<AppointmentRepository.FindByVeterinarianIdAndDateResult>;
    findByPetId(params: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult>;
    bulkCreate(params: AppointmentRepository.BulkCreateParams): Promise<AppointmentRepository.BulkCreateResult>;
}

export namespace AppointmentRepository {
    export type FindByVeterinarianIdAndDateParams = {
        veterinarianId: string;
        date: Date[];
    };
    export type FindByPetIdParams = {
        petId: string;
    };
    export type BulkCreateParams = {
        appointments: AppointmentModel[];
    };
    export type FindAllResult = AppointmentModel[] | null;
    export type FindByVeterinarianIdAndDateResult = AppointmentModel[] | null;
    export type FindByPetIdResult = AppointmentModel[] | null;
    export type BulkCreateResult = void;
}
