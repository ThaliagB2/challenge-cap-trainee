import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { AppointmentRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(translator, veterinarianRepository, petRepository, appointmentRepository);
};
