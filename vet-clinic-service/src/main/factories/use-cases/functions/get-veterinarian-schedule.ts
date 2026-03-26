import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { AppointmentsRepositoryImpl, PetsRepositoryImpl, VeterinariansRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterunarianRepository = new VeterinariansRepositoryImpl();
    const appointmentRepository = new AppointmentsRepositoryImpl();
    const petRepository = new PetsRepositoryImpl();
    return new GetVeterinarianScheduleUseCaseImpl(veterunarianRepository, appointmentRepository, petRepository, translator);
};
