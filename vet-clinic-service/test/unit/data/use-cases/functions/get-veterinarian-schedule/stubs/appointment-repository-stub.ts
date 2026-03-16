import { AppointmentRepository } from '@/domain/repositories';
import { AppointmentModel } from '@/domain/models/db/appointment';

export class AppointmentRepositoryStub implements AppointmentRepository {
    public appointments: AppointmentModel[] = [];

    public async findByPetId(petId: string): Promise<AppointmentModel[]> {
        return this.appointments.filter((appointment) => appointment.pet_id === petId);
    }

    public async findByVetIdAndDate(vetId: string, today: Date, futureDate: Date): Promise<AppointmentModel[]> {
        return this.appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            const todayStart = new Date(today);
            todayStart.setHours(0, 0, 0, 0);
            const futureDateEnd = new Date(futureDate);
            futureDateEnd.setHours(23, 59, 59, 999);
            return appointment.veterinarian_id === vetId && appointmentDate >= todayStart && appointmentDate <= futureDateEnd;
        });
    }

    public async create(appointment: AppointmentModel): Promise<void> {
        this.appointments.push(appointment);
    }

    public async generateReportByOwnerId(ownerId: string): Promise<AppointmentModel[]> {
        return this.appointments.filter((appointment) => appointment.status === 'COMPLETED');
    }
}

