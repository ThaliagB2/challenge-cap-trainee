import { AppointmentModel } from '@/domain/models/db/appointment';
import { AppointmentRepository } from '@/domain/repositories';

export class AppointmentRepositoryStub implements AppointmentRepository {
    private error: Error | null = null;
    public createdAppointments: AppointmentModel[] = [];

    public setError(error: Error): void {
        this.error = error;
    }

    public async create(appointment: AppointmentModel): Promise<void> {
        if (this.error) {
            throw this.error;
        }
        this.createdAppointments.push(appointment);
    }

    public async findByPetId(petId: string): Promise<AppointmentModel[]> {
        return [];
    }

    public async findByVetIdAndDate(vetId: string, today: Date, futureDate: Date): Promise<AppointmentModel[]> {
        return [];
    }

    public async generateReportByOwnerId(ownerId: string): Promise<AppointmentModel[]> {
        return [];
    }
}

