import { AppointmentsModel } from '@/domain/models/db/appointments';
import { AppointmentsRepository } from '@/domain/repositories';

export class AppointmentsRepositoryStub implements AppointmentsRepository {
    private appointmentsByOwner: Map<string, AppointmentsModel[]> = new Map();
    private appointments: AppointmentsModel[] = [];

    public setupAppointmentsByOwner(appointmentsByOwner: Map<string, AppointmentsModel[]>): void {
        this.appointmentsByOwner = appointmentsByOwner;
    }

    public addAppointmentForOwner(ownerId: string, appointment: AppointmentsModel): void {
        const ownerAppointments = this.appointmentsByOwner.get(ownerId) || [];
        ownerAppointments.push(appointment);
        this.appointmentsByOwner.set(ownerId, ownerAppointments);
    }

    public async findPetsByOwnerId(ownerId: string): Promise<string[]> {
        const appointments = this.appointmentsByOwner.get(ownerId) || [];
        return appointments.map((appointment) => appointment.pet_id);
    }

    public async findByPetIdsAndStatus(petIds: string[], status: string): Promise<AppointmentsModel[]> {
        const result: AppointmentsModel[] = [];

        this.appointmentsByOwner.forEach((appointments) => {
            appointments
                .filter((appointment) => petIds.includes(appointment.pet_id) && appointment.status === status)
                .forEach((appointment) => result.push(appointment));
        });

        return result;
    }

    public async create(appointment: AppointmentsModel[]): Promise<void> {
        this.appointments.push(...appointment);
    }

    public async findVetIdandDate(): Promise<AppointmentsModel[]> {
        return [];
    }

    public async findByOwnerIdAndStatus(): Promise<AppointmentsModel[]> {
        return [];
    }
}
