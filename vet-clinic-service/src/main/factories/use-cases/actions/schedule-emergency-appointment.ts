import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { AppointmentsRepositoryImpl, PetsRepositoryImpl, VeterinariansRepositoryImpl } from '@/infra/db/hana/repositories';
import { makeTranslator } from '@/main/factories/utils/translator';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const petRepository = new PetsRepositoryImpl();
    const vetRepository = new VeterinariansRepositoryImpl();
    const appointmentRepository = new AppointmentsRepositoryImpl();
    const translator = makeTranslator();
    return new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, vetRepository, appointmentRepository, translator);
};
