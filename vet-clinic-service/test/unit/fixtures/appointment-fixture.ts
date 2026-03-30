import { AppointmentsModel } from '@/domain/models/db/appointments';
import { ProceduresProps } from '@/domain/models/db/procedures';

export class AppointmentFixture {
    private data: {
        id: string;
        date: Date;
        status: string;
        isEmergency: boolean;
        totalCost: number;
        notes: string;
        pet_id: string;
        veterinarian_id: string;
        procedures: ProceduresProps[];
    } = {
        id: 'apt-1',
        date: new Date('2025-01-01T10:00:00Z'),
        status: 'SCHEDULED',
        isEmergency: false,
        totalCost: 100,
        notes: 'Emergency session',
        pet_id: 'pet-1',
        veterinarian_id: 'vet-1',
        procedures: [{ id: 'proc-1', description: 'Consult', cost: 100 }]
    };

    withId(id: string): this {
        this.data = { ...this.data, id };
        return this;
    }

    withDate(date: Date): this {
        this.data = { ...this.data, date };
        return this;
    }

    withStatus(status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'): this {
        this.data = { ...this.data, status };
        return this;
    }

    withPetId(pet_id: string): this {
        this.data = { ...this.data, pet_id };
        return this;
    }

    withVeterinarianId(veterinarian_id: string): this {
        this.data = { ...this.data, veterinarian_id };
        return this;
    }

    withTotalCost(cost: number): this {
        this.data = { ...this.data, totalCost: cost };
        return this;
    }

    withProcedures(procedures: ProceduresProps[]): this {
        this.data = { ...this.data, procedures };
        return this;
    }

    asEmergency(): this {
        this.data = { ...this.data, isEmergency: true };
        return this;
    }

    build(): AppointmentsModel {
        return AppointmentsModel.with(this.data);
    }
}

export const createDefaultAppointment = (): AppointmentFixture => new AppointmentFixture();

export const buildDefaultAppointment = (): AppointmentsModel =>
    new AppointmentFixture().build();
