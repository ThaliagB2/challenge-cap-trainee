import cds from '@sap/cds';

import { AppointmentsModel, AppointmentsProps } from '@/domain/models/db/appointments';
import { ProceduresProps } from '@/domain/models/db/procedures';
import { AppointmentsRepository } from '@/domain/repositories';

export class AppointmentsRepositoryImpl implements AppointmentsRepository {
    private readonly ENTITY = 'db.models.Appointments';
    private readonly ENTITY_PETS = 'db.models.Pets';

    public async findPetById(petId: AppointmentsRepository.FindPetByIdAndOwnerParams): Promise<AppointmentsRepository.Result> {
        const petAppointmentsQuerry = cds.ql.SELECT.from(this.ENTITY).where({ pet_id: petId });
        const petAppointments: AppointmentsProps[] = await cds.run(petAppointmentsQuerry);
        return this.mapToAppointmentsModel(petAppointments);
    }

    public async create(appointment: AppointmentsModel[]): Promise<void> {
        const appointmentData = appointment.map((appointment) => appointment.toObject());
        await cds.create(this.ENTITY).entries(appointmentData);
    }
    public async findVetIdandDate(params: AppointmentsRepository.FindVetIdandDateParams): Promise<AppointmentsRepository.Result> {
        const query = cds.ql.SELECT.from(this.ENTITY).where([
            { ref: ['veterinarian_id'] },
            '=',
            { val: params.vetId },
            'and',
            { func: 'date', args: [{ ref: ['date'] }] },
            'in',
            { list: params.dates.map((d) => ({ val: d })) }
        ]);

        const result: AppointmentsProps[] = await cds.run(query);

        if (result.length === 0) {
            return null;
        }
        return this.mapToAppointmentsModel(result);
    }

    // Metodo que busca owners e pets com o status 'COMPLETED'
    // Dividido em duas chamadas de banco: primeiro busca os pets do owner, depois os appointments
    public async findPetsByOwnerId(params: AppointmentsRepository.FindPetByIdAndOwnerParams): Promise<AppointmentsRepository.PetIdsResult> {
        const petsQuery = cds.ql.SELECT.from(this.ENTITY_PETS).columns('id').where({ owner_id: params });
        const pets: { id: string }[] = await cds.run(petsQuery);
        return pets.map((pet) => String(pet.id));
    }

    public async findByPetIdsAndStatus(petIds: string[], status: string): Promise<AppointmentsRepository.Result> {
        if (petIds.length === 0) {
            return [];
        }

        const appointmentsQuery = cds.ql.SELECT.from(this.ENTITY).where({ status, pet_id: { in: petIds } });
        const appointmentsResult: AppointmentsProps[] = await cds.run(appointmentsQuery);

        return this.mapToAppointmentsModel(appointmentsResult);
    }

    public async findByOwnerIdAndStatus(Params: AppointmentsRepository.FindByOwnerIdAndStatusParams): Promise<AppointmentsRepository.Result> {
        const petIds = await this.findPetsByOwnerId(Params.ownerId);
        return this.findByPetIdsAndStatus(petIds, Params.status);
    }

    private mapToAppointmentsModel(appointmentsResult: AppointmentsProps[]): AppointmentsRepository.Result {
        return appointmentsResult.map((appointment) => {
            return AppointmentsModel.with({
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
    // tipo any refatorado
    private mapProcedures(procedures: ProceduresProps[]): ProceduresProps[] {
        return procedures.map((procedure) => ({
            id: procedure.id,
            description: procedure.description,
            cost: procedure.cost
        }));
    }
}
