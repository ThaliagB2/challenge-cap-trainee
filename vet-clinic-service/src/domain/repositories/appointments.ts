//Interface para Appointments (criar, buscar por veterinário e período, buscar por pet IDs)

import { AppointmentsModel } from '../models/db/appointments';

export interface appointmentsRepository {
    create(appointments: AppointmentsModel): Promise<AppointmentsModel>;
    findvetById(vetId: string, date: Date): Promise<AppointmentsModel[]>;
    findPetById(petId: string): Promise<AppointmentsModel[]>;
}
