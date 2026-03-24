/* eslint-disable max-lines-per-function */
import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { VeterinarianScheduleModel, VeterinarianScheduleProps } from '@/domain/models/db/veterinarian-schedule';
import { AppointmentRepository, OwnerRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly ownerRepository: OwnerRepository,
        private readonly petRepository: PetRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {
        this.veterinarianRepository = veterinarianRepository;
        this.ownerRepository = ownerRepository;
        this.petRepository = petRepository;
        this.appointmentRepository = appointmentRepository;
        this.translator = translator;
    }

    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result> {
        try {
            if (!params.veterinarian_id) {
                return left(new BadRequestError('veterinarianIdIsRequired'));
            }

            const veterinarian = await this.veterinarianRepository.findById({ id: params.veterinarian_id });
            if (!veterinarian) {
                const message = this.translator.translate('noVeterinarianFound');
                return left(new NotFoundError(message));
            }

            const days = !params.days ? 7 : params.days;
            const datesArray = this.getDatesArray(days);

            const vetAppointments = await this.appointmentRepository.findByVeterinarianIdAndDate({ veterinarianId: params.veterinarian_id, dates: datesArray });
            if (!vetAppointments) {
                return left(new NotFoundError(this.translator.translate('veterinarianScheduleNotFound')));
            }

            const vetAppointmentsObject = vetAppointments.map((vetSchedule) => vetSchedule.toFullObject());
            const sorted = vetAppointmentsObject.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const veterinarianSchedule: VeterinarianScheduleProps[] = await Promise.all(
                sorted.map(async (s) => {
                    const pet = await this.petRepository.findById({ id: s.pet_id });
                    const owner = await this.ownerRepository.findById({ id: pet.owner_id });
                    return VeterinarianScheduleModel.with({
                        appointment_id: s.id,
                        date: s.date,
                        status: s.status,
                        isEmergency: s.isEmergency,
                        totalCost: s.formattedTotalCost,
                        notes: s.notes,
                        veterinarian: veterinarian.toCreationObject(),
                        owner: owner.toCreationObject(),
                        pet: pet.toCreationObject(),
                        procedures: s.procedures
                    }).toCreationObject();
                })
            );
            return right(veterinarianSchedule);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private getDatesArray(days: number): string[] {
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            return date.toISOString().split('T')[0];
        });
    }
}
