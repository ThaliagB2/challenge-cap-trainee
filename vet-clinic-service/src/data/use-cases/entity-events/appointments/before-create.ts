import { left, right } from '@sweet-monads/either';

import { BadRequestError } from '@/domain/errors/bad-request';
import { NotFoundError } from '@/domain/errors/not-found';
import { ServerError } from '@/domain/errors/server';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';

export class BeforeCreateAppointmentUseCaseImpl implements BeforeCreateAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository
    ) {
        this.petRepository = petRepository;
        this.veterinarianRepository = veterinarianRepository;
    }

    public async execute(params: BeforeCreateAppointmentUseCase.Params): BeforeCreateAppointmentUseCase.Result {
        try {
            const pet = await this.petRepository.findById(params.pet_id);
            if (!pet) {
                return left(new NotFoundError('Pet not found'));
            }

            const veterinarian = await this.veterinarianRepository.findById(params.veterinarian_id);

            if (!veterinarian) {
                return left(new NotFoundError('Veterinarian not found'));
            }

            if (!params.procedures || params.procedures.length === 0) {
                return left(new BadRequestError('At least one procedure is required'));
            }

            const appointment = AppointmentModel.with({
                ...params,
                status_id: params.status_id ?? 'SCHEDULED',
                totalCost: params.totalCost ?? 0
            });

            return right(appointment.toObject());
        } catch (error) {
            const errorData = error as Error;

            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }
}
