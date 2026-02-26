import { AppointmentsModel } from '../models/db/appointments';

export interface appointmentsRepository {
    findPetById(petId: string): Promise<AppointmentsModel[]>;
    create(appointment: AppointmentsModel[]): Promise<void>;
    findVetIdandDate(vetId: string, date: number): Promise<AppointmentsModel[]>;
}
