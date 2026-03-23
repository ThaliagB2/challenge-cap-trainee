import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findByPetId(petId: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult>;
    findByVetIdAndDate(params: AppointmentRepository.FindByVetIdAndDateParams): Promise<AppointmentRepository.FindByVetIdAndDateResult>;
    create(appointment: AppointmentRepository.CreateParams): Promise<AppointmentRepository.CreateResult>;
    generateReportByOwnerId(ownerId: AppointmentRepository.GenerateReportByOwnerIdParams): Promise<AppointmentRepository.GenerateReportByOwnerIdResult>;
}

export namespace AppointmentRepository {
    export type FindByPetIdParams = string;
    export type FindByPetIdResult = AppointmentModel[];
    export type FindByVetIdAndDateParams = {
        vetId: string;
        today: Date;
        futureDate: Date;
    };
    export type FindByVetIdAndDateResult = AppointmentModel[];
    export type CreateParams = AppointmentModel;
    export type CreateResult = void;
    export type GenerateReportByOwnerIdParams = string;
    export type GenerateReportByOwnerIdResult = AppointmentModel[];
}
