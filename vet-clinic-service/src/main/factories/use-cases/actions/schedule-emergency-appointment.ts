import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { translator } from '../../utils/translator';
import { AppointmentRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, translator);
};
