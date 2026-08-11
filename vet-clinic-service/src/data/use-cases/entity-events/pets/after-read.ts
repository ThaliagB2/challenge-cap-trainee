import { left, right } from '@sweet-monads/either';

import { ServerError } from '@/domain/errors/server';
import { AfterReadPetsUseCase } from '@/domain/use-cases/entity-events/pets';

export class AfterReadPetsUseCaseImpl implements AfterReadPetsUseCase {
    public execute(pets: AfterReadPetsUseCase.Params): AfterReadPetsUseCase.Result {
        try {
            const petsWithAge = pets.map((pet) => ({
                ...pet,
                age: this.calculateAge(pet.birthDate)
            }));

            return right(petsWithAge);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }

    private calculateAge(birthDateValue: string): number {
        const currentDate = new Date();
        const birthDate = new Date(birthDateValue);

        const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
        const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;

        return Math.floor(ageInMilliseconds / millisecondsPerYear);
    }
}
