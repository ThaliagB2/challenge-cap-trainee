import { left, right } from '@sweet-monads/either';

import { BeforeCreateAppointmentUseCase, PayloadResult } from '@/domain/use-cases/entity-events/appointments';
import { Translator } from '@/domain/utils/translator';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { PetRepository, VeterinarianRepository } from '@/domain/repositories';

export class BeforeCreateAppointmentUseCaseImpl implements BeforeCreateAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly translator: Translator
    ) {}

    async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        const petExists = await this.validatePetExists(params.pet_id);
        if (petExists.hasError) {
            return left(new NotFoundError(petExists.errorMessage));
        }

        const veterinarianExists = await this.validateVeterinarianExists(params.veterinarian_id);
        if (veterinarianExists.hasError) {
            return left(new NotFoundError(veterinarianExists.errorMessage));
        }

        if (params.procedures.length === 0) {
            return left(new BadRequestError('No procedures provided'));
        }

        const totalCost = params.procedures.reduce((total, procedure) => total + procedure.cost, 0);
        params.totalCost = totalCost;

        if (!params.status) {
            params.status = 'SCHEDULED';
        }

        return right({
            hasError: false,
            payload: params
        });
    }

    private async validatePetExists(petId: string): Promise<PayloadResult> {
        const pet = await this.petRepository.findById(petId);

        if (!pet) {
            return {
                hasError: true,
                errorMessage: 'Pet not found'
            };
        }

        return {
            pet,
            hasError: false
        };
    }

    private async validateVeterinarianExists(veterinarianId: string): Promise<PayloadResult> {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);

        if (!veterinarian) {
            return {
                hasError: true,
                errorMessage: 'Veterinarian not found'
            };
        }

        return {
            veterinarian,
            hasError: false
        };
    }
}
