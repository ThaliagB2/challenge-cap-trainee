import { AppointmentModel } from '../models/db/appointment';

export interface AppointmentRepository {
    findByPetId(petId: string): Promise<AppointmentModel[]>;
    findByVetIdAndDate(vetId: string, date: Date): Promise<AppointmentModel[]>;
    create(appointment: AppointmentModel): Promise<AppointmentModel>;
}
