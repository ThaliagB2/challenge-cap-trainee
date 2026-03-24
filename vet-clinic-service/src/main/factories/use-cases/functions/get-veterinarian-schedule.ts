import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { AppointmentsRepositoryImpl, OwnersRepositoryImpl, PetsRepositoryImpl, ProceduresRepositoryImpl, VeterinariansRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterunarianRepository = new VeterinariansRepositoryImpl();
    const appointmentRepository = new AppointmentsRepositoryImpl();
    const petRepository = new PetsRepositoryImpl();
    const ownerRepository = new OwnersRepositoryImpl();
    const procedureRepository = new ProceduresRepositoryImpl();
    return new GetVeterinarianScheduleUseCaseImpl(veterunarianRepository, appointmentRepository, ownerRepository, petRepository, procedureRepository, translator);
};
