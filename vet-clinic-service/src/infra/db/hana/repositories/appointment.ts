import { AppointmentModel } from '@/domain/models/db/appointment';
import { OwnerProps } from '@/domain/models/db/owner';
import { PetProps } from '@/domain/models/db/pet';
import { ProcedureProps } from '@/domain/models/db/procedure';
import { VeterinarianProps } from '@/domain/models/db/veterinarian';
import { AppointmentRepository } from '@/domain/repositories';
import { Appointment, Appointments } from '@models/db/models';
import cds from '@sap/cds';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly APPOINTMENT = 'db.models.appointments';

    public async findAll(): Promise<AppointmentModel[] | null> {
        const appointmentsQuery = cds.ql.SELECT.from(this.APPOINTMENT);
        const appointments: Appointments = await cds.run(appointmentsQuery);

        if (appointments.length === 0) return null;

        return appointments.map((appointment) => this.modelAppointmentObject(appointment));
    }

    public async findByVeterinarianIdAndDate(veterinarianId: string, date: Date[]): Promise<AppointmentModel[] | null> {
        const appointmentsQuery = cds.ql.SELECT.from(this.APPOINTMENT).where({ id: veterinarianId, date: { in: date } });
        const appointments: Appointments = await cds.run(appointmentsQuery);

        if (appointments.length === 0) return null;

        return appointments.map((appointment) => this.modelAppointmentObject(appointment));
    }

    public async findByPetId(petId: string): Promise<AppointmentModel[] | null> {
        const appointmentsQuery = cds.ql.SELECT.from(this.APPOINTMENT).where({ id: petId });
        const appointments: Appointments = await cds.run(appointmentsQuery);

        if (appointments.length === 0) return null;

        return appointments.map((appointment) => this.modelAppointmentObject(appointment));
    }

    public async bulkCreate(appointments: AppointmentModel[]): Promise<void> {
        const appointmentsData = appointments.map((app) => app.toCreationObject());
        const query = cds.ql.INSERT.into(this.APPOINTMENT).entries(appointmentsData);
        await cds.run(query);
    }

    private modelAppointmentObject(appointment: Appointment): AppointmentModel {
        return AppointmentModel.with({
            id: appointment.id as string,
            date: appointment.date as unknown as Date,
            status: appointment.status as string,
            isEmergency: appointment.isEmergency as boolean,
            totalCost: appointment.totalCost as number,
            notes: appointment.notes as string,
            procedures: appointment.procedures as unknown as ProcedureProps[],
            owner: appointment.id as unknown as OwnerProps,
            pet: appointment.pet as unknown as PetProps,
            veterinarian: appointment.id as unknown as VeterinarianProps
        });
    }
}
