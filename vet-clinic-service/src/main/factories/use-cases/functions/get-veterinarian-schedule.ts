import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { AppointmentRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new GetVeterinarianScheduleUseCaseImpl(veterinarianRepository, appointmentRepository, translator);
};
