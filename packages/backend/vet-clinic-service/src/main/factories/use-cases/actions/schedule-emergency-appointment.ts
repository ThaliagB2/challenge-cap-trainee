import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { BeforeCreateAppointmentUseCases } from '@/domain/use-cases/entity-events/appointments/before-create';
import { AppointmentRepositoryImpl, PetRepositoryImpl, ProcedureRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

const makeScheduleEmergencyAppointmentUseCase = (): BeforeCreateAppointmentUseCases => {
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    const procedureRepository = new ProcedureRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, procedureRepository);
};

export const scheduleEmergencyAppointmentUseCase = makeScheduleEmergencyAppointmentUseCase();
