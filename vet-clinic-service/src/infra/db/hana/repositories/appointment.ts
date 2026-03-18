import cds from '@sap/cds';

import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';
import { AppointmentRepository } from '@/domain/repositories';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly ENTITY = 'db.models.appointments';

    public async findAll(): Promise<AppointmentRepository.FindAllResult> {
        const query = cds.ql.SELECT.from(this.ENTITY);
        const result: AppointmentProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => AppointmentModel.with(r));
    }

    public async findByVeterinarianIdAndDate(params: AppointmentRepository.FindByVeterinarianIdAndDateParams): Promise<AppointmentRepository.FindByVeterinarianIdAndDateResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ id: params.veterinarianId, date: { in: params.date } });
        const result: AppointmentProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => AppointmentModel.with(r));
    }

    public async findByPetId(params: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ id: params.petId });
        const result: AppointmentProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => AppointmentModel.with(r));
    }

    public async bulkCreate(params: AppointmentRepository.BulkCreateParams): Promise<AppointmentRepository.BulkCreateResult> {
        const appointmentsData = params.appointments.map((app) => app.toCreationObject());
        const query = cds.ql.INSERT.into(this.ENTITY).entries(appointmentsData);
        await cds.run(query);
    }
}
