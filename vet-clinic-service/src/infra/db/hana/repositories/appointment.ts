import cds from '@sap/cds';

import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';
import { AppointmentRepository } from '@/domain/repositories';

type AppointmentDatabaseRow = Omit<AppointmentProps, 'procedures'>;

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly ENTITY_NAME = 'db.models.Appointments';

    public async create(appointment: AppointmentRepository.CreateParams): Promise<AppointmentRepository.CreateResult> {
        const query = cds.ql.INSERT.into(this.ENTITY_NAME).entries(appointment.toObject());

        await cds.run(query);
    }

    public async findByVeterinarianAndPeriod(params: AppointmentRepository.FindByVeterinarianAndPeriodParams): Promise<AppointmentRepository.FindByVeterinarianAndPeriodResult> {
        const { veterinarianId, startDate, endDate } = params;

        const appointmentsQuery = cds.ql.SELECT.from(this.ENTITY_NAME).where({
            veterinarian_id: veterinarianId,
            date: {
                between: startDate,
                and: endDate
            }
        });

        const appointments = (await cds.run(appointmentsQuery)) as AppointmentDatabaseRow[];

        return appointments.map((appointment) =>
            AppointmentModel.with({
                id: appointment.id as string,
                date: appointment.date as string,
                status_id: appointment.status_id as string,
                isEmergency: appointment.isEmergency as boolean,
                totalCost: appointment.totalCost as number,
                notes: appointment.notes as string,
                pet_id: appointment.pet_id as string,
                veterinarian_id: appointment.veterinarian_id as string,
                procedures: []
            })
        );
    }

    public async findByPetIds(petIds: AppointmentRepository.FindByPetIdsParams): Promise<AppointmentRepository.FindByPetIdsResult> {
        const appointmentsQuery = cds.ql.SELECT.from(this.ENTITY_NAME).where({
            pet_id: {
                in: petIds
            }
        });

        const appointments = (await cds.run(appointmentsQuery)) as AppointmentDatabaseRow[];

        return appointments.map((appointment) =>
            AppointmentModel.with({
                id: appointment.id as string,
                date: appointment.date as string,
                status_id: appointment.status_id as string,
                isEmergency: appointment.isEmergency as boolean,
                totalCost: appointment.totalCost as number,
                notes: appointment.notes as string,
                pet_id: appointment.pet_id as string,
                veterinarian_id: appointment.veterinarian_id as string,
                procedures: []
            })
        );
    }
}
