import { GetVeterinarianScheduleItemUseCaseImpl } from "@/data/use-cases/functions/veterinarian-schedule";
import { GetVeterinarianScheduleItemUseCase } from "@/domain/use-cases/functions/veterinarian-schedule";
import { AppointmentRepositoryImpl, OwnerRepositoryImpl, PetRepositoryImpl, VeterinarianRepositoryImpl } from "@/infra/db/hana/repositories";

const makeGetVeterinarianScheduleItemUseCase = (): GetVeterinarianScheduleItemUseCase => {
    const veterinarianRepository = new VeterinarianRepositoryImpl;
    const appointmentRepository = new AppointmentRepositoryImpl;
    const petRepository = new PetRepositoryImpl;
    const ownerRepository = new OwnerRepositoryImpl;
    return new GetVeterinarianScheduleItemUseCaseImpl(veterinarianRepository, appointmentRepository, petRepository, ownerRepository)
}

export const getVeterinarianScheduleItemUseCase = makeGetVeterinarianScheduleItemUseCase()