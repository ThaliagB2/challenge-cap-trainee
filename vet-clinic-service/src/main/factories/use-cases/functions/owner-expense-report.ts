import { GetOwnerExpenseReportUseCaseImpl } from '@/data/use-cases/functions';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions';
import { AppointmentRepositoryImpl, OwnerRepositoryImpl, PetRepositoryImpl } from '@/infra/db/hana/repositories';

const makeGetOwnerExpenseReportUseCase = (): GetOwnerExpenseReportUseCase => {
    const ownerRepository = new OwnerRepositoryImpl();
    const petRepository = new PetRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new GetOwnerExpenseReportUseCaseImpl(ownerRepository, petRepository, appointmentRepository);
};

export const getOwnerExpenseReportUseCase = makeGetOwnerExpenseReportUseCase();
