import { BeforeCreateAppointmentUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { AppointmentRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeBeforeCreateAppointmentUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new BeforeCreateAppointmentUseCaseImpl(translator, veterinarianRepository, petRepository, appointmentRepository);
};
