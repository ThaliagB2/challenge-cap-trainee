import { makeGetOwnerExpenseReportUseCase } from '@/main/factories/use-cases/functions/get-owner-expense-report';
import { GetOwnerExpenseReport } from '@/presentation/functions/get-owner-expense-report';

export const makeGetOwnerExpenseReportController = () => {
    const useCase = makeGetOwnerExpenseReportUseCase();
    return new GetOwnerExpenseReport(useCase);
};

export const getOwnerExpenseReportController = makeGetOwnerExpenseReportController();
