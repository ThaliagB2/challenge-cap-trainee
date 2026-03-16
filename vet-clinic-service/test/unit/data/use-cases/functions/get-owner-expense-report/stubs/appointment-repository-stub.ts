import { AppointmentRepository } from '@/domain/repositories';
import { AppointmentModel } from '@/domain/models/db/appointment';

export class AppointmentRepositoryStub implements AppointmentRepository {
    public appointmentsByOwner: Map<string, AppointmentModel[]> = new Map();

    public async findByPetId(petId: string): Promise<AppointmentModel[]> {
        return [];
    }

    public async findByVetIdAndDate(vetId: string, today: Date, futureDate: Date): Promise<AppointmentModel[]> {
        return [];
    }

    public async create(appointment: AppointmentModel): Promise<void> {
        // Not needed for this test
    }

    public async generateReportByOwnerId(ownerId: string): Promise<AppointmentModel[]> {
        return this.appointmentsByOwner.get(ownerId) || [];
    }
}

