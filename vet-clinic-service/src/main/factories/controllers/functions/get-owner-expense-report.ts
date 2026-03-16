import { makeGetOwnerExpenseReportUseCase } from '@/main/factories/use-cases/functions/get-owner-expense-report';
import { GetOwnerExpenseReportController } from '@/presentation/functions/get-owner-expense-report';

export const makeGetOwnerExpenseReportController = () => {
    const useCase = makeGetOwnerExpenseReportUseCase();
    return new GetOwnerExpenseReportController(useCase);
};

export const getOwnerExpenseReportController = makeGetOwnerExpenseReportController();
