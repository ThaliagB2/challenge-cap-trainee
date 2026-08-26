import { BeforeCreateAppointmentUseCasesImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { BeforeCreateAppointmentUseCases } from '@/domain/use-cases/entity-events/appointments/before-create';
import { PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

const makeBeforeCreateAppointmentUseCase = (): BeforeCreateAppointmentUseCases => {
    const petsRepository = new PetRepositoryImpl();
    const veterianarianRepository = new VeterinarianRepositoryImpl();
    return new BeforeCreateAppointmentUseCasesImpl(petsRepository, veterianarianRepository);
};

export const beforeCreateAppointmentUseCase = makeBeforeCreateAppointmentUseCase();
