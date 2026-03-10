import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findAll(): Promise<AppointmentModel>[];
    findByIdAndDate(id: string, date?: Date): Promise<AppointmentModel[]>;
    bulkCreate(appointments: AppointmentModel[]): Promise<void>;
}
