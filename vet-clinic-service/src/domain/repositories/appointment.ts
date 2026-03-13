import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findAll(): Promise<AppointmentModel[]>;
    findByVeterinarianIdAndDate(veterinarianId: string, date: Date[]): Promise<AppointmentModel[]>;
    findByPetId(petId: string): Promise<AppointmentModel[]>;
    bulkCreate(appointments: AppointmentModel[]): Promise<void>;
}
