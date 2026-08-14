import { BeforeCreateAppointmentUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { PetRepositoryImpl } from '@/infra/db/hana/repositories/pet';
import { VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories/veterinarian';

export const makeBeforeCreateAppointmentUseCase = () => {
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();

    return new BeforeCreateAppointmentUseCaseImpl(petRepository, veterinarianRepository);
};
