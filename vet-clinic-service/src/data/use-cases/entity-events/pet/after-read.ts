import { right } from '@sweet-monads/either';

import { AfterReadPetUseCase } from '@/domain/use-cases/entity-events/pets';
import { PetModel, PetWithAgeProps, PetProps } from '@/domain/models/db/pet';

export class AfterReadPetUseCaseImpl implements AfterReadPetUseCase {
    async execute(params: AfterReadPetUseCase.Params): Promise<AfterReadPetUseCase.Result> {
        const petsWithAge = params.map((pet) => this.addPetAge(pet));
        return right(petsWithAge);
    }

    private addPetAge(params: PetProps): PetWithAgeProps {
        const petData = {
            ...params,
            birthDate: params.birthDate instanceof Date ? params.birthDate : new Date(params.birthDate)
        };

        const pet = PetModel.create(petData);
        return {
            ...pet.toObject(),
            age: pet.calculateAge()
        };
    }
}
