import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { translator } from '@/main/factories/utils/translator';
import { AppointmentRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(translator, veterinarianRepository, petRepository, appointmentRepository);
};
