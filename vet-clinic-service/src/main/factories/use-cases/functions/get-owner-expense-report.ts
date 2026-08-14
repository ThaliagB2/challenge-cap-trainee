import { GetOwnerExpenseReportUseCaseImpl } from '@/data/use-cases/functions/get-owner-expense-report';
import { AppointmentRepositoryImpl } from '@/infra/db/hana/repositories/appointment';
import { OwnerRepositoryImpl } from '@/infra/db/hana/repositories/owner';
import { PetRepositoryImpl } from '@/infra/db/hana/repositories/pet';

export const makeGetOwnerExpenseReportUseCase = () => {
    const ownerRepository = new OwnerRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();

    return new GetOwnerExpenseReportUseCaseImpl(ownerRepository, petRepository, appointmentRepository);
};
