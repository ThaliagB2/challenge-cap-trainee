import { PetsModel } from '@/domain/models/db/pets';
import { AfterReadPetUseCase, afterReadPetUsecase } from '@/domain/use-cases/entity-events/Pets';
import { right } from '@sweet-monads/either';

type PetDataWithAge = ReturnType<PetsModel['toObject']> & { age: number };
// tirar duvida se pode deixar esse tipo nessa camada

export class AfterReadPetsUseCaseImpl implements afterReadPetUsecase {
    constructor() {}

    public async execute(params: AfterReadPetUseCase.Params): Promise<AfterReadPetUseCase.Result> {
        const petAge = params.map((pet) => this.calculateAge(pet));
        return right(petAge);
    }

    private calculateAge(pet: Omit<PetDataWithAge, 'age'>): PetDataWithAge {
        const birthDate = new Date(pet.birthDate).getTime();
        const today = new Date().getTime();

        //Fórmula: age = floor((dataAtual - birthDate) / 365.25)
        const agePetsYars = (today - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
        const age = Math.floor(agePetsYars);

        return {
            ...pet,
            age
        };
    }
}
