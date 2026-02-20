import cds from '@sap/cds';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { AppointmentRepository } from '@/domain/repositories';
import { Appointments } from '@models/db/models';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    async findByPetId(petId: string): Promise<AppointmentModel[]> {
        const petAppointmentQuery = SELECT.from('Appointments').where({ pet_id: petId });
        const petAppointment: Appointments = await cds.run(petAppointmentQuery);
        return petAppointment.map((appointment) => {
            return AppointmentModel.create({
                id: appointment.id,
                date: appointment.date.toString(),
                status: appointment.status,
                isEmergency: appointment.isEmergency,
                totalCost: appointment.totalCost,
                notes: appointment.notes,
                pet_id: appointment.pet_id,
                veterinarian_id: appointment.veterinarian_id,
                procedures: appointment.procedures.map((procedure) => {
                    return {
                        id: procedure.id,
                        description: procedure.description,
                        cost: procedure.cost
                    };
                })
            });
        });
    }

    async findByVetIdAndDate(vetId: string, date: Date): Promise<AppointmentModel[]> {
        const resultQuery = SELECT.from('Appointments').where({ veterinarian_id: vetId, date });
        const result: Appointments = await cds.run(resultQuery);
        return result.map((appointment) => {
            return AppointmentModel.create({
                id: appointment.id,
                date: appointment.date.toString(),
                status: appointment.status,
                isEmergency: appointment.isEmergency,
                totalCost: appointment.totalCost,
                notes: appointment.notes,
                pet_id: appointment.pet_id,
                veterinarian_id: appointment.veterinarian_id,
                procedures: appointment.procedures.map((procedure) => {
                    return {
                        id: procedure.id,
                        description: procedure.description,
                        cost: procedure.cost
                    };
                })
            });
        });
    }

    async create(appointment: AppointmentModel[]): Promise<void> {
        const appointmentData = appointment.map((appointment) => appointment.toObject());
        await cds.create('Appointments').entries(appointmentData);
    }
}
