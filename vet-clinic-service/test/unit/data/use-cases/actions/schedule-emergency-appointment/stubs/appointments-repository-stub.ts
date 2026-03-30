import { AppointmentsModel } from '@/domain/models/db/appointments';
import { AppointmentsRepository } from '@/domain/repositories';

export class AppointmentsRepositoryStub implements AppointmentsRepository {
    private appointments: AppointmentsModel[] = [];

    public setupAppointments(appointments: AppointmentsModel[]): void {
        this.appointments = appointments;
    }

    public getAppointments(): AppointmentsModel[] {
        return this.appointments;
    }

    public async create(appointment: AppointmentsModel[]): Promise<void> {
        this.appointments.push(...appointment);
    }

    public async findVetIdandDate(): Promise<AppointmentsModel[]> {
        return [];
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
