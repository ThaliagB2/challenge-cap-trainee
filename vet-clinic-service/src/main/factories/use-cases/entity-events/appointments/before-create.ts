import { BeforeCreateAppointmentUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { OwnerRepositoryImpl, PetRepositoryImpl, ProcedureRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeBeforeCreateAppointmentUseCase = () => {
    const ownerRepository = new OwnerRepositoryImpl();
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const procedureRepository = new ProcedureRepositoryImpl();
    return new BeforeCreateAppointmentUseCaseImpl(translator, ownerRepository, veterinarianRepository, petRepository, procedureRepository);
};
