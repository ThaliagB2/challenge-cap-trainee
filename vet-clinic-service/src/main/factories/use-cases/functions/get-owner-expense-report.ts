import { GetOwnerExpenseReportImpl } from '@/data/use-cases/functions/get-owner-expense-report';
import { AppointmentsRepositoryImpl, OwnersRepositoryImpl } from '@/infra/db/hana/repositories';
import { translator } from '../../utils/translator';

export const makeGetOwnerExpenseReportUseCase = () => {
    const ownerRepository = new OwnersRepositoryImpl();
    const appointmentRepository = new AppointmentsRepositoryImpl();
    return new GetOwnerExpenseReportImpl(ownerRepository, appointmentRepository, translator);
};
