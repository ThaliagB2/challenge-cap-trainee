import cds from '@sap/cds';

import { AppointmentRepository } from '@/domain/repositories';
import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly ENTITY = 'db_models_Appointments';

    public async findByPetId(petId: string): Promise<AppointmentModel[]> {
        const petAppointmentQuery = SELECT.from(this.ENTITY).where({ pet_id: petId });
        const petAppointment: AppointmentProps[] = await cds.run(petAppointmentQuery);
        return petAppointment.map((appointment) => {
            return AppointmentModel.create({ ...appointment });
        });
    }

    public async findByVetIdAndDate(vetId: string, today: Date, futureDate: Date): Promise<AppointmentModel[]> {
        const resultQuery = SELECT.from(this.ENTITY).where({ veterinarian_id: vetId }).and('date >=', today).and('date <=', futureDate).orderBy('date');
        const appointments: AppointmentProps[] = await cds.run(resultQuery);

        return appointments.map((appointment) => {
            return AppointmentModel.create({ ...appointment });
        });
    }

    public async create(appointment: AppointmentModel): Promise<void> {
        const appointmentData = {
            id: appointment.id,
            date: appointment.date,
            status: appointment.status,
            isEmergency: appointment.isEmergency ? 1 : 0,
            totalCost: Number(appointment.totalCost),
            notes: appointment.notes,
            pet_id: appointment.pet_id,
            veterinarian_id: appointment.veterinarian_id
        };

        await cds.create(this.ENTITY).entries([appointmentData]);

        if (appointment.procedures && appointment.procedures.length > 0) {
            const proceduresData = appointment.procedures.map((proc) => ({
                id: proc.id,
                description: proc.description,
                cost: Number(proc.cost),
                appointment_id: appointment.id
            }));

            await cds.create('db_models_Procedures').entries(proceduresData);
        }
    }

    public async generateReportByOwnerId(ownerId: string): Promise<AppointmentModel[]> {
        const appointmentsByOwnerQuery = SELECT.from(this.ENTITY)
            .where({ status: 'COMPLETED' })
            .and('pet_id IN', SELECT('id').from('db_models_Pets').where({ owner_id: ownerId }));

        const appointmentsByOwner: AppointmentProps[] = await cds.run(appointmentsByOwnerQuery);

        return appointmentsByOwner.map((appointment) => {
            return AppointmentModel.create({ ...appointment });
        });
    }
}
