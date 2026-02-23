import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { AppointmentRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new GetVeterinarianScheduleUseCaseImpl(veterinarianRepository, appointmentRepository);
};
