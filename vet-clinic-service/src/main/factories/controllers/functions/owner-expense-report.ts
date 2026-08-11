import { GetOwnerExpenseReportController } from '@/presentation/functions';
import { getOwnerExpenseReportUseCase } from '../../use-cases/functions';

const makeGetOwnerExpenseReportController = (): GetOwnerExpenseReportController => {
    return new GetOwnerExpenseReportController(getOwnerExpenseReportUseCase);
};

export const getOwnerExpenseReportController = makeGetOwnerExpenseReportController();
