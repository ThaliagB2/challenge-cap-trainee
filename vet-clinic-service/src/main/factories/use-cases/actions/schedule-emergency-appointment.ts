import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { AppointmentsRepositoryImpl, PetsRepositoryImpl, VeterinariansRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const petRepository = new PetsRepositoryImpl();
    const vetRepository = new VeterinariansRepositoryImpl();
    const appointmentRepository = new AppointmentsRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, vetRepository, appointmentRepository);
};
