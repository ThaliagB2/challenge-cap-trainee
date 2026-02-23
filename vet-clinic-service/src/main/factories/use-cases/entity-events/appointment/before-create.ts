import { BeforeCreateAppointmentUseCaseImpl } from '@/data/use-cases/entity-events/appointment/before-create';
import { translator } from '@/main/factories/utils/translator';
import { PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeBeforeCreateAppointmentUseCase = () => {
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    return new BeforeCreateAppointmentUseCaseImpl(petRepository, veterinarianRepository, translator);
};
