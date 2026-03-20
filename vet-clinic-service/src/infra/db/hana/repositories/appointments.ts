import cds from '@sap/cds';

import { Appointments } from '@models/db/models';

import { AppointmentsModel } from '@/domain/models/db/appointments';
import { appointmentsRepository } from '@/domain/repositories';

export class AppointmentsRepositoryImpl implements appointmentsRepository {
    private readonly ENTITY = 'db.models.Appointments';

    public async findPetById(petId: string): Promise<AppointmentsModel[]> {
        const petAppointmentsQuerry = cds.ql.SELECT.from(this.ENTITY).where({ pet_id: petId });
        const petAppointments: Appointments = await cds.run(petAppointmentsQuerry);
        return this.mapToAppointmentsModel(petAppointments);
    }

    public async create(appointment: AppointmentsModel[]): Promise<void> {
        const appointmentData = appointment.map((appointment) => appointment.toObject());
        await cds.create(this.ENTITY).entries(appointmentData);
    }

    public async findVetIdandDate(vetId: string, days: number): Promise<AppointmentsModel[]> {
        const today = new Date();
        const futureDays = new Date();
        futureDays.setDate(today.getDate() + days);
        const vetAppointmentsQuerry = cds.ql.SELECT.from(this.ENTITY).where({ veterinarian_id: vetId, date: { '>=': today, '<=': futureDays } });
        const vetAppointmentsResult: Appointments = await cds.run(vetAppointmentsQuerry);
        return this.mapToAppointmentsModel(vetAppointmentsResult);
    }

    public async findByOwnerIdAndStatus(ownerId: string): Promise<AppointmentsModel[]> {
        const query = cds.ql.SELECT.from(this.ENTITY)
            .where({ status: 'COMPLETED' })
            .and('pet_id IN', cds.ql.SELECT.from('db.models.Pets').columns('id').where({ owner_id: ownerId }));

        const appointmentsResult: Appointments = await cds.run(query);

        return this.mapToAppointmentsModel(appointmentsResult);
    }

    private mapToAppointmentsModel(appointmentsResult: Appointments): AppointmentsModel[] {
        return appointmentsResult.map((appointment) => {
            return AppointmentsModel.create({
                id: String(appointment.id),
                date: new Date(appointment.date),
                status: appointment.status ?? 'SCHEDULED',
                isEmergency: appointment.isEmergency ?? false,
                totalCost: Number(appointment.totalCost ?? 0),
                notes: appointment.notes ?? '',
                pet_id: String(appointment.pet_id),
                veterinarian_id: String(appointment.veterinarian_id),
                procedures: this.mapProcedures(appointment.procedures ?? [])
            });
        });
    }

    private mapProcedures(procedures: any[]): any[] {
        return procedures.map((procedure) => ({
            id: procedure.id,
            description: procedure.description,
            cost: procedure.cost
        }));
    }
}
