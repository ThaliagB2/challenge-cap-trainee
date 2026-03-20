import { left, right } from '@sweet-monads/either';

import { NotFoundError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';
import { appointmentsRepository, ownersRepository, petsRepository, proceduresRepository, veterinariansRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly vetRepository: veterinariansRepository,
        private readonly appointmentRepository: appointmentsRepository,
        private readonly ownerRepository: ownersRepository,
        private readonly petRepository: petsRepository,
        private readonly procedureRepository: proceduresRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    public async execute(veterinarianId: string, days = 7): Promise<GetVeterinarianScheduleUseCase.Result> {
        const vet = await this.vetRepository.findVeterinarianById(veterinarianId);
        if (!vet) {
            const message = this.translator.translate('Veterinario não encontrado');
            return left(new NotFoundError(message));
        }
        const today = new Date();
        const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
        const appointments = await this.appointmentRepository.findVetIdandDate(veterinarianId, today.getDay(), futureDate);

        if (appointments.length === 0) {
            const message = this.translator.translate('Agendamentos não encontrados neste periodo');
            return left(new NotFoundError(message));
        }

        const schedule = await Promise.all(
            appointments.map(async (appointment) => {
                const pet = await this.petRepository.findPetsById(appointment.pet_id);
                const owner = await this.ownerRepository.findOwnersById(pet.owner_id);
                const procedures = await this.procedureRepository.findByAppointmentId(appointment.id);

                return VeterinarianScheduleModel.create({
                    id: appointment.id,
                    date: appointment.date,
                    status: appointment.status,
                    isEmergency: appointment.isEmergency,
                    totalCost: appointment.totalCost,
                    veterinarianId: appointment.veterinarian_id,
                    procedure: procedures.map((proc) => proc.toObject()),
                    pet: pet.toObject(),
                    owner: owner.toObject()
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
}
