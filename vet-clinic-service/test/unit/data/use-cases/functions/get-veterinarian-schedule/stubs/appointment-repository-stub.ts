import { AppointmentsModel } from '@/domain/models/db/appointments';
import { AppointmentsRepository } from '@/domain/repositories';

export class AppointmentsRepositoryStub implements AppointmentsRepository {
    private appointments: AppointmentsModel[] = [];

    public setupAppointments(appointments: AppointmentsModel[]): void {
        this.appointments = appointments;
    }

    public addAppointment(appointment: AppointmentsModel): void {
        this.appointments.push(appointment);
    }

    public async findVetIdandDate(params: AppointmentsRepository.FindVetIdandDateParams): Promise<AppointmentsModel[]> {
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);

        return this.appointments.filter((appointment) => {
            const date = new Date(appointment.date);
            return appointment.veterinarian_id === params.vetId && date >= startDate && date <= endDate;
        });
    }

    public async create(appointment: AppointmentsModel[]): Promise<void> {
        return;
    }

    public async findPetsByOwnerId(): Promise<string[]> {
        return [];
    }

    public async findByPetIdsAndStatus(): Promise<AppointmentsModel[]> {
        return [];
    }

    public async findByOwnerIdAndStatus(): Promise<AppointmentsModel[]> {
        return [];
    }
}
