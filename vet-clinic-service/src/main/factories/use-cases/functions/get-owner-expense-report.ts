import { GetOwnerExpenseReportUseCaseImpl } from '@/data/use-cases/functions/get-owner-expense-report';
import { translator } from '@/main/factories/utils/translator';
import { AppointmentRepositoryImpl, OwnerRepositoryImpl } from '@/infra/db/hana/repositories';

export const makeGetOwnerExpenseReportUseCase = () => {
    const ownerRepository = new OwnerRepositoryImpl();
    const appointmentRepository = new AppointmentRepositoryImpl();
    return new GetOwnerExpenseReportUseCaseImpl(ownerRepository, appointmentRepository, translator);
};
