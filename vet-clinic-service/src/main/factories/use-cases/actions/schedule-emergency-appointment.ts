import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { AppointmentRepositoryImpl } from '@/infra/db/hana/repositories/appointment';
import { PetRepositoryImpl } from '@/infra/db/hana/repositories/pet';
import { ProcedureRepositoryImpl } from '@/infra/db/hana/repositories/procedure';
import { VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories/veterinarian';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const appointmentRepository = new AppointmentRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const procedureRepository = new ProcedureRepositoryImpl();

    return new ScheduleEmergencyAppointmentUseCaseImpl(appointmentRepository, petRepository, veterinarianRepository, procedureRepository);
};
