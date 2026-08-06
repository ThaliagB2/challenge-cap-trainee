import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    create(appointment: AppointmentModel): Promise<void>;

    findByVeterinarianAndPeriod(veterinarianId: string, startDate: string, endDate: string): Promise<AppointmentModel[]>;

    findByPetIds(petIds: string[]): Promise<AppointmentModel[]>;
}
