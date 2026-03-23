import cds from '@sap/cds';

import { AppointmentRepository } from '@/domain/repositories';
import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly ENTITY = 'db_models_Appointments';

    public async findByPetId(petId: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult> {
        const petAppointmentQuery = cds.ql.SELECT.from(this.ENTITY).where({ pet_id: petId });
        const petAppointment: AppointmentProps[] = await cds.run(petAppointmentQuery);
        return petAppointment.map((appointment) => {
            return AppointmentModel.create({ ...appointment });
        });
    }

    public async findByVetIdAndDate(params: AppointmentRepository.FindByVetIdAndDateParams): Promise<AppointmentRepository.FindByVetIdAndDateResult> {
        const resultQuery = cds.ql.SELECT.from(this.ENTITY).where({ veterinarian_id: params.vetId }).and('date >=', params.today).and('date <=', params.futureDate).orderBy('date');
        const appointments: AppointmentProps[] = await cds.run(resultQuery);

        return appointments.map((appointment) => {
            return AppointmentModel.create({ ...appointment });
        });
    }

    public async create(appointment: AppointmentRepository.CreateParams): Promise<AppointmentRepository.CreateResult> {
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
    }

    public async generateReportByOwnerId(ownerId: AppointmentRepository.GenerateReportByOwnerIdParams): Promise<AppointmentRepository.GenerateReportByOwnerIdResult> {
        const appointmentsByOwnerQuery = cds.ql.SELECT.from(this.ENTITY)
            .where({ status: 'COMPLETED' })
            .and('pet_id IN', SELECT('id').from('db_models_Pets').where({ owner_id: ownerId }));

        const appointmentsByOwner: AppointmentProps[] = await cds.run(appointmentsByOwnerQuery);

        return appointmentsByOwner.map((appointment) => {
            return AppointmentModel.create({ ...appointment });
        });
    }
}
