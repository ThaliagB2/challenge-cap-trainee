import { PetsModel } from '@/domain/models/db/pets';
import { AfterReadPetUseCase } from '@/domain/use-cases/entity-events/pets';
import { right } from '@sweet-monads/either';

export class AfterReadPetsUseCaseImpl implements AfterReadPetUseCase {
    public async execute(params: AfterReadPetUseCase.Params) {
        const result = params.map((pet) => {
            const normalizedPet = {
                ...pet,
                birthDate: pet.birthDate instanceof Date ? pet.birthDate : new Date(pet.birthDate)
            };

            return PetsModel.create(normalizedPet).withAge();
        });

        return right(result);
    }
}
