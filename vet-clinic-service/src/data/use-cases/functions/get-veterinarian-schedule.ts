import { left, right } from '@sweet-monads/either';

import { FullAppointmentProps } from '@/domain/models/db/appointment';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentRepository, OwnerRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { NotFoundError, ServerError } from '@/domain/errors';
import { VeterinarianScheduleModel, VeterinarianScheduleProps } from '@/domain/models/db/veterinarian-schedule';

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
            const vetId = params.veterinarian_id;
            if (!vetId) {
                return left(new NotFoundError(this.translator.translate('veterinarianIdIsRequired')));
            }

            const vetScheduleModel = VeterinarianScheduleModel.createDraft();

            const veterinarian = await this.getVeterinarian(vetId);
            if (!veterinarian) {
                return left(new NotFoundError(this.translator.translate('noVeterinarianFound')));
            }

            const datesArray = vetScheduleModel.getDatesArray(params.days);

            const appointments = await this.getSortedVeterinarianAppointments(vetId, datesArray);
            if (!appointments) {
                return left(new NotFoundError(this.translator.translate('veterinarianScheduleNotFound')));
            }

            const veterinarianSchedule = await this.generateVeterianarianSchedule(appointments, veterinarian);
            return right(veterinarianSchedule);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getVeterinarian(vetId: string): Promise<VeterinarianModel> {
        return await this.veterinarianRepository.findById({ id: vetId });
    }

    private async getSortedVeterinarianAppointments(vetId: string, datesArray: string[]): Promise<FullAppointmentProps[]> {
        const vetRepositories = (await this.appointmentRepository.findByVeterinarianIdAndDate({ veterinarianId: vetId, dates: datesArray })).map((app) => app.toFullObject());
        return vetRepositories.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    private async generateVeterianarianSchedule(appointments: FullAppointmentProps[], veterinarian: VeterinarianModel): Promise<VeterinarianScheduleProps[]> {
        const veterinarianSchedule = await Promise.all(
            appointments.map(async (app) => {
                const pet = await this.petRepository.findById({ id: app.pet_id });
                const owner = await this.ownerRepository.findById({ id: pet.owner_id });

                return VeterinarianScheduleModel.create({
                    appointment_id: app.id,
                    date: app.date,
                    status: app.status,
                    isEmergency: app.isEmergency,
                    totalCost: app.formattedTotalCost,
                    notes: app.notes,
                    veterinarian: veterinarian.toCreationObject(),
                    owner: owner.toCreationObject(),
                    pet: pet.toCreationObject(),
                    procedures: app.procedures
                }).toCreationObject();
            })
        );

        return veterinarianSchedule;
    }
}
