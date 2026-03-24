import { left, right } from '@sweet-monads/either';

import { NotFoundError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';
import { AppointmentsRepository, OwnersRepository, PetsRepository, ProceduresRepository, VeterinariansRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly vetRepository: VeterinariansRepository,
        private readonly appointmentRepository: AppointmentsRepository,
        private readonly ownerRepository: OwnersRepository,
        private readonly petRepository: PetsRepository,
        private readonly procedureRepository: ProceduresRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result> {
        const vet = await this.vetRepository.findVeterinarianById(params.veterinarianId);
        if (!vet) {
            const message = this.translator.translate('Veterinario não encontrado');
            return left(new NotFoundError(message));
        }
        const days = !params.days ? 7 : params.days;
        const dataArray = this.getDatesArray(days);
        const appointments = await this.appointmentRepository.findVetIdandDate({ vetId: params.veterinarianId, dates: dataArray });

        if (appointments.length === 0) {
            const message = this.translator.translate('Agendamentos não encontrados neste periodo');
            return left(new NotFoundError(message));
        }

        const schedule = await Promise.all(
            appointments.map(async (appointment) => {
                const pet = await this.petRepository.findPetsById(appointment.pet_id);

                return VeterinarianScheduleModel.with({
                    id: appointment.id,
                    date: appointment.date,
                    status: appointment.status,
                    isEmergency: appointment.isEmergency,
                    totalCost: appointment.totalCost,
                    veterinarian_id: appointment.veterinarian_id,
                    procedure: appointment.procedures,
                    pet_id: appointment.pet_id,
                    owner_id: pet.owner_id
                });
            })
        );
        const orderedDates = schedule.sort((a, b) => {
            const dateA = new Date(String(a.date)).getTime();
            const dateB = new Date(String(b.date)).getTime();
            return dateA - dateB;
        });
        return right(orderedDates);
    }

    private getDatesArray(days: number): string[] {
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            return date.toISOString();
        });
    }
}
