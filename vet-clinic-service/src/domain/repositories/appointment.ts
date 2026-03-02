import { AppointmentModel } from '@/domain/models/db/appointment';

export interface AppointmentRepository {
    findByPetId(petId: string): Promise<AppointmentModel[]>;
    findByVetIdAndDate(vetId: string, today: Date, futureDate: Date): Promise<AppointmentModel[]>;
    create(appointment: AppointmentModel): Promise<void>;
    generateReportByOwnerId(ownerId: string): Promise<AppointmentModel[]>;
}
