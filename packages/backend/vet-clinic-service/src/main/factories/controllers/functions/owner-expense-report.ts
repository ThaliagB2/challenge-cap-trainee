import { getOwnerExpenseReportUseCase } from '@/main/factories/use-cases/functions';
import { translator } from '@/main/factories/utils/translator';
import { GetOwnerExpenseReportController } from '@/presentation/functions';

const makeGetOwnerExpenseReportController = (): GetOwnerExpenseReportController => {
    return new GetOwnerExpenseReportController(getOwnerExpenseReportUseCase, translator);
};

export const getOwnerExpenseReportController = makeGetOwnerExpenseReportController();
