import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findByPetId(id: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult>;
    findByVeterinarianAndPeriod(params: AppointmentRepository.FindByVeterinarianAndPeriodParams): Promise<AppointmentRepository.FindByVeterinarianAndPeriodResult>;
    create(appointment: AppointmentRepository.CreateParams): Promise<AppointmentRepository.CreateResult>;
}

export namespace AppointmentRepository {
    export type FindByPetIdParams = string;
    export type FindByPetIdResult = AppointmentModel[] | null;
    export type FindByVeterinarianAndPeriodParams = { veterinarian_id: string; start: Date; end: Date };
    export type FindByVeterinarianAndPeriodResult = AppointmentModel[] | null;
    export type CreateParams = AppointmentModel;
    export type CreateResult = void;
}
