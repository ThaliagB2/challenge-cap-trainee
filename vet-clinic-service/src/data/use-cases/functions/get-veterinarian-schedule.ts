import { left, right } from '@sweet-monads/either';

import { NotFoundError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/get-veterinarian-schedule';
import { AppointmentsRepository, PetsRepository, VeterinariansRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly vetRepository: VeterinariansRepository,
        private readonly appointmentRepository: AppointmentsRepository,
        private readonly petRepository: PetsRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result> {
        const vet = await this.vetRepository.findVeterinarianById(params.veterinarianId);
        if (!vet) {
            const message = this.translator.translate('Veterinario_não_encontrado');
            return left(new NotFoundError(message));
        }

        const days = VeterinarianScheduleModel.resolveDays(params.days);

        const { startDate, endDate } = VeterinarianScheduleModel.getDateRange(days);
        const appointments = await this.appointmentRepository.findVetIdandDate({
            vetId: params.veterinarianId,
            startDate,
            endDate
        });

        if (!appointments || appointments.length === 0) {
            const message = this.translator.translate('Agendamentos_não_encontrados_neste_periodo');
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
                    procedures: appointment.procedures,
                    pet_id: appointment.pet_id,
                    owner_id: pet.owner_id,
                    notes: appointment.notes
                });
            })
        );

        const orderedSchedule = VeterinarianScheduleModel.orderByDate(schedule);

        return right(orderedSchedule);
    }
}
