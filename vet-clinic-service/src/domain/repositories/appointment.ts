import { AppointmentModel } from '../models/db/appointment';

export interface AppointmentRepository {
    findByPetId(petId: string): Promise<AppointmentModel[]>;
    findByVetIdAndDate(vetId: string, days: number): Promise<AppointmentModel[]>;
    create(appointment: AppointmentModel[]): Promise<void>;
    generateReportByOwnerId(ownerId: string): Promise<AppointmentModel[]>;
}
