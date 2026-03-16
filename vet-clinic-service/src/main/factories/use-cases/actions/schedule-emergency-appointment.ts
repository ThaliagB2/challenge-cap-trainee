import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { OwnerRepositoryImpl, PetRepositoryImpl, ProcedureRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeScheduleEmergencyAppointmentUseCase = () => {
    const ownerRepository = new OwnerRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const procedureRepository = new ProcedureRepositoryImpl();
    return new ScheduleEmergencyAppointmentUseCaseImpl(translator, ownerRepository, veterinarianRepository, petRepository, procedureRepository);
};
