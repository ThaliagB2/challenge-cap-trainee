import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { BeforeCreateAppointmentUseCases } from '@/domain/use-cases/entity-events/appointments/before-create';

export class BeforeCreateAppointmentUseCasesImpl implements BeforeCreateAppointmentUseCases {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository
    ) {}

    public async execute(appointment: BeforeCreateAppointmentUseCases.BeforeCreateParams): Promise<BeforeCreateAppointmentUseCases.BeforeCreateResult> {
        try {
            const pet = await this.petRepository.findById(appointment.pet_id);
            if (!pet) {
                return left(new NotFoundError('pet.notFound'));
            }

            const veterianarian = await this.veterinarianRepository.findById(appointment.veterinarian_id);
            if (!veterianarian) {
                return left(new NotFoundError('veterinaria.notFound'));
            }

            if (!appointment.procedures || appointment.procedures.length == 0) {
                return left(new BadRequestError('appointment.atLasteOneProcedure'));
            }

            //composition cria as procedures automaticamente no CAP

            const model = AppointmentModel.forCreate(appointment);
            return right(model.toCreationObject());
        } catch (error) {
            const err = error as Error;
            return left(new ServerError(err.stack));
        }
    }
}
