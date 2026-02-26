import { left, right } from '@sweet-monads/either';

import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';
import { petsRepository, veterinariansRepository } from '@/domain/repositories';
import { Translator } from '@/domain/utils/translator';
import { PetsModel } from '@/domain/models/db/pets';
import { VeterinariansModel } from '@/domain/models/db/veterinarians';

export class BeforeCreateAppointmentsUseCaseImpl implements BeforeCreateAppointmentUseCase {
    constructor(
        private readonly petRepository: petsRepository,
        private readonly vetRepository: veterinariansRepository,
        private readonly translator: Translator
    ) {
        this.petRepository = petRepository;
        this.vetRepository = vetRepository;
        this.translator = translator;
    }

    public async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BeforeCreateAppointmentUseCase.Result> {
        
    }

    private async validatePet(PetId: string): Promise<PetsModel>{
        const pet = await this.petRepository.findPetsById(PetId);
        return pet;
    }

    private async validateVet(veterinarianId: string): Promise<VeterinariansModel>{
        const vet = await this.vetRepository.findVeterinarianById(veterinarianId);
        return vet;
    }
}
