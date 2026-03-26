import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentsModel } from '@/domain/models/db/appointments';
import { PetsRepository, VeterinariansRepository } from '@/domain/repositories';
import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';
import { Translator } from '@/domain/utils/translator';

export class BeforeCreateAppointmentsUseCaseImpl implements BeforeCreateAppointmentUseCase {
    constructor(
        private readonly petRepository: PetsRepository,
        private readonly vetRepository: VeterinariansRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        try {
            const pet = await this.petRepository.findPetsById(params.pet_id);
            if (!pet) {
                return left(new NotFoundError(this.translator.translate('petNotFound')));
            }

            const vet = await this.vetRepository.findVeterinarianById(params.veterinarian_id);
            if (!vet) {
                return left(new NotFoundError(this.translator.translate('veterinarianNotFound')));
            }

            if (!params.procedures || params.procedures.length === 0) {
                return left(new BadRequestError(this.translator.translate('noProceduresProvided')));
            }

            const appointment = AppointmentsModel.createRegular({
                ...params,
                status: params.status ?? 'SCHEDULED'
            });

            return right(appointment);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }
}
