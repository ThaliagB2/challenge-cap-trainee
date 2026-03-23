import cds from '@sap/cds';

import { AppointmentModel, AppointmentProps } from '@/domain/models/db/appointment';
import { AppointmentRepository } from '@/domain/repositories';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    private readonly ENTITY = 'db.models.Appointments';

    public async findByVeterinarianIdAndDate(params: AppointmentRepository.FindByVeterinarianIdAndDateParams): Promise<AppointmentRepository.FindByVeterinarianIdAndDateResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where([
            { ref: ['veterinarian_id'] },
            '=',
            { val: params.veterinarianId },
            'and',
            { func: 'date', args: [{ ref: ['date'] }] },
            'in',
            { list: params.dates.map((d) => ({ val: d })) }
        ]);
        const result: AppointmentProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => AppointmentModel.with(r));
    }

    public async findByPetId(params: AppointmentRepository.FindByPetIdParams): Promise<AppointmentRepository.FindByPetIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY).where({ pet_id: params.petId });
        const result: AppointmentProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }

        return result.map((r) => AppointmentModel.with(r));
    }

    public async findByOwnerId(params: AppointmentRepository.FindByOwnerIdParams): Promise<AppointmentRepository.FindByOwnerIdResult> {
        const query = cds.ql.SELECT.from(this.ENTITY)
            .where({ status: 'COMPLETED' })
            .and([{ ref: ['pet_id'] }, 'in', cds.ql.SELECT.from('db.models.Pets').columns('id').where({ owner_id: params.ownerId })]);

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
