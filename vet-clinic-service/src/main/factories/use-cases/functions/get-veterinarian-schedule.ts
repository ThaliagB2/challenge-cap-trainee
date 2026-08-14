import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { AppointmentRepositoryImpl } from '@/infra/db/hana/repositories/appointment';
import { OwnerRepositoryImpl } from '@/infra/db/hana/repositories/owner';
import { PetRepositoryImpl } from '@/infra/db/hana/repositories/pet';
import { VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories/veterinarian';

export const makeGetVeterinarianScheduleUseCase = () => {
    const veterinarianRepository = new VeterinarianRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const ownerRepository = new OwnerRepositoryImpl();

    return new GetVeterinarianScheduleUseCaseImpl(veterinarianRepository, appointmentRepository, petRepository, ownerRepository);
};
