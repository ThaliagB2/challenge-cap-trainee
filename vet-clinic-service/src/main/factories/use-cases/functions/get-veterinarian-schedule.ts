import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { translator } from '@/main/factories/utils/translator';
import { AppointmentRepositoryImpl, VeterinarianRepositoryImpl, PetRepositoryImpl, OwnerRepositoryImpl, ProcedureRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const ownerRepository = new OwnerRepositoryImpl();
    const procedureRepository = new ProcedureRepositoryImpl();
    return new GetVeterinarianScheduleUseCaseImpl(veterinarianRepository, appointmentRepository, petRepository, ownerRepository, procedureRepository, translator);
};
