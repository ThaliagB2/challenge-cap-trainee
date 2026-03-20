import { BeforeCreateAppointmentsUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { PetsRepositoryImpl, VeterinariansRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeBeforeCreateAppointmentUseCase = () => {
    const petRepository = new PetsRepositoryImpl();
    const vetRepository = new VeterinariansRepositoryImpl();
    return new BeforeCreateAppointmentsUseCaseImpl(petRepository, vetRepository);
};
