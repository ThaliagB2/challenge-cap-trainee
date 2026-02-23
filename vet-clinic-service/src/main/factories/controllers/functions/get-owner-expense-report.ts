import { GetOwnerExpenseReportController } from '@/presentation/functions/get-owner-expense-report';
import { makeGetOwnerExpenseReportUseCase } from '../../use-cases/functions/get-owner-expense-report';

export const makeGetOwnerExpenseReportController = () => {
    const useCase = makeGetOwnerExpenseReportUseCase();
    return new GetOwnerExpenseReportController(useCase);
};

export const getOwnerExpenseReportController = makeGetOwnerExpenseReportController();
