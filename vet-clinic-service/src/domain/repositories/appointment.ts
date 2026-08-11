import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    create(appointment: AppointmentRepository.CreateParams): Promise<AppointmentRepository.CreateResult>;

    findByVeterinarianAndPeriod(params: AppointmentRepository.FindByVeterinarianAndPeriodParams): Promise<AppointmentRepository.FindByVeterinarianAndPeriodResult>;

    findByPetIds(petIds: AppointmentRepository.FindByPetIdsParams): Promise<AppointmentRepository.FindByPetIdsResult>;
}

export namespace AppointmentRepository {
    export type CreateParams = AppointmentModel;
    export type CreateResult = void;

    export type FindByVeterinarianAndPeriodParams = {
        veterinarianId: string;
        startDate: string;
        endDate: string;
    };

    export type FindByVeterinarianAndPeriodResult = AppointmentModel[];

    export type FindByPetIdsParams = string[];
    export type FindByPetIdsResult = AppointmentModel[];
    export type AppointmentDatabaseRow = Omit<AppointmentProps, 'procedures'>;
}
