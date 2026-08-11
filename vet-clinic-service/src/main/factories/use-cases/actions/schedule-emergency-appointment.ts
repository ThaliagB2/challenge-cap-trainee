import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { BeforeCreateAppointmentUseCases } from '@/domain/use-cases/entity-events/appointments/before-create';
import { PetRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

const makeScheduleEmergencyAppointmentUseCase = (): BeforeCreateAppointmentUseCases => {
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository);
};

export const scheduleEmergencyAppointmentUseCase = makeScheduleEmergencyAppointmentUseCase();
