import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { translator } from '@/main/factories/utils/translator';
import { AppointmentRepositoryImpl, OwnerRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const ownerRepository = new OwnerRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new GetVeterinarianScheduleUseCaseImpl(veterinarianRepository, ownerRepository, petRepository, appointmentRepository, translator);
};
