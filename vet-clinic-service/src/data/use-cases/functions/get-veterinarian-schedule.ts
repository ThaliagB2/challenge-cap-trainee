import { left, right } from '@sweet-monads/either';

import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { AppointmentRepository, VeterinarianRepository, PetRepository, OwnerRepository, ProcedureRepository } from '@/domain/repositories';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly petRepository: PetRepository,
        private readonly ownerRepository: OwnerRepository,
        private readonly procedureRepository: ProcedureRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result> {
        if (!params.veterinarianId) {
            const message = this.translator.translate('veterinarianIsRequired');
            return left(new BadRequestError(message));
        }

        const veterinarianExists = await this.validateVeterinarianExists(params.veterinarianId);

        if (!veterinarianExists) {
            const message = this.translator.translate('veterinarianNotFound');
            return left(new NotFoundError(message));
        }

        const today = new Date();
        const futureDate = new Date(today.getTime() + params.days * 24 * 60 * 60 * 1000);
        const appointments = await this.appointmentRepository.findByVetIdAndDate({ vetId: params.veterinarianId, today, futureDate });

        if (appointments.length === 0) {
            const message = this.translator.translate('appointmentsNotFound');
            return left(new NotFoundError(message));
        }

        const schedulings = await Promise.all(
            appointments.map(async (appointment) => {
                const pet = await this.petRepository.findById(appointment.pet_id);
                const owner = await this.ownerRepository.findById(pet.owner_id);
                const procedures = await this.procedureRepository.findByAppointmentId(appointment.id);

                return VeterinarianScheduleModel.create({
                    id: appointment.id,
                    date: appointment.date,
                    status: appointment.status,
                    isEmergency: appointment.isEmergency,
                    totalCost: appointment.totalCost,
                    notes: appointment.notes,
                    veterinarian_id: appointment.veterinarian_id,
                    procedures: procedures.map((proc) => proc.toObject()),
                    pet: pet.toObject(),
                    owner: owner.toObject()
                });
            })
        );

        return right(schedulings);
    }

    private async validateVeterinarianExists(veterinarianId: string): Promise<VeterinarianModel> {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);
        return veterinarian;
    }
}
