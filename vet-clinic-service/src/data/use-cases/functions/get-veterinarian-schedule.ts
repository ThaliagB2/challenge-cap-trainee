import { left, right } from '@sweet-monads/either';

import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentModel, FullAppointmentProps } from '@/domain/models/db/appointment';
import { AppointmentRepository, OwnerRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { NotFoundError, ServerError } from '@/domain/errors';

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

            const appointmentModel = AppointmentModel.createVeterinarianScheduleDraft();

            const veterinarian = await this.getVeterinarian(vetId);
            if (!veterinarian) {
                return left(new NotFoundError(this.translator.translate('veterinarianNotFound')));
            }

            const datesArray = appointmentModel.getDatesArray(params.days);

            const appointments = await this.getSortedVeterinarianAppointments(vetId, datesArray);
            if (!appointments) {
                return left(new NotFoundError(this.translator.translate('veterinarianScheduleNotFound')));
            }
            const sortedAppointmentsObj = appointments.map((app) => app.toFullObject()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            return right(this.generateVeterianarianSchedule(appointmentModel, sortedAppointmentsObj, veterinarian));
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getVeterinarian(vetId: string): Promise<VeterinarianModel> {
        return await this.veterinarianRepository.findById({ id: vetId });
    }

    private async getSortedVeterinarianAppointments(vetId: string, datesArray: string[]): Promise<AppointmentModel[]> {
        return await this.appointmentRepository.findByVeterinarianIdAndDate({ veterinarianId: vetId, dates: datesArray });
    }

    private async generateVeterianarianSchedule(
        appointmentModel: AppointmentModel,
        appointments: FullAppointmentProps[],
        veterinarian: VeterinarianModel
    ): Promise<AppointmentModel[]> {
        const veterinarianSchedule = await Promise.all(
            appointments.map(async (app) => {
                const pet = await this.petRepository.findById({ id: app.pet_id });
                const owner = await this.ownerRepository.findById({ id: pet.owner_id });
                return appointmentModel.createVeterianarianSchedule(app, veterinarian, owner, pet);
            })
        );
        return veterinarianSchedule;
    }
}
