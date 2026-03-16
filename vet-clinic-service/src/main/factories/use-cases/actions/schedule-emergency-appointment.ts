import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { translator } from '@/main/factories/utils/translator';
import { AppointmentRepositoryImpl, PetRepositoryImpl, ProcedureRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    const procedureRepository = new ProcedureRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, procedureRepository, translator);
};
