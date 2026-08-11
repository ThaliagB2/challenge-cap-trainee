import cds from '@sap/cds';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { AppointmentRepository } from '@/domain/repositories/appointments';
import { Appointment } from '@models/db/models';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly ENTITY_NAME = 'db.models.Appointments';

    public async findByPetId(id: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult> {
        const appointments = await cds.ql.SELECT.from(this.ENTITY_NAME).where({ pet_id: id });
        if (appointments.length == 0) {
            return null;
        }
        return appointments.map((appointment: Appointment) => this.toModel(appointment));
    }

    public async findByVeterinarianAndPeriod(params: AppointmentRepository.FindByVeterinarianAndPeriodParams): Promise<AppointmentRepository.FindByVeterinarianAndPeriodResult> {
        const appointments = await cds.ql.SELECT.from(this.ENTITY_NAME).where({ veterinarian_id: params.veterinarian_id }).and('date >=', params.start).and('date <=', params.end);
        if (appointments.length == 0) {
            return null;
        }
        return appointments.map((appointment: Appointment) => this.toModel(appointment));
    }

    public async create(appointment: AppointmentRepository.CreateParams): Promise<AppointmentRepository.CreateResult> {
        const data = appointment.toCreationObject();
        const query = cds.ql.INSERT.into(this.ENTITY_NAME).entries(data);
        await cds.run(query);
    }

    private toModel(appointment: Appointment): AppointmentModel {
        return AppointmentModel.with({
            id: appointment.id!,
            date: appointment.date,
            status_id: appointment.status_id,
            isEmergency: appointment.isEmergency,
            totalCost: appointment.totalCost,
            notes: appointment.notes,
            pet_id: appointment.pet_id,
            veterinarian_id: appointment.veterinarian_id
        });
    }
}
