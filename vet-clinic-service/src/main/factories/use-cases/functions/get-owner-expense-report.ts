import { GetOwnerExpenseReportUseCaseImpl } from '@/data/use-cases/functions/get-owner-expense-report';
import { AppointmentRepositoryImpl, OwnerRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '@/main/factories/utils/translator';

export const makeGetOwnerExpenseReportUseCase = () => {
    const ownerRepository = new OwnerRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new GetOwnerExpenseReportUseCaseImpl(translator, ownerRepository, appointmentRepository);
};
