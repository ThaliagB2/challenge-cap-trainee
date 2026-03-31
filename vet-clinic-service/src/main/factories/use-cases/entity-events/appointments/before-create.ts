import { BeforeCreateAppointmentUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { translator } from '@/main/factories/utils/translator';
import { AppointmentRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeBeforeCreateAppointmentUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new BeforeCreateAppointmentUseCaseImpl(translator, veterinarianRepository, petRepository, appointmentRepository);
};
