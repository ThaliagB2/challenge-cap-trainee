import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { BaseControllerImpl, BaseControllerResponse } from '../base/controller';

export class GetOwnerExpenseReport extends BaseControllerImpl {
    constructor(private readonly useCase: GetOwnerExpenseReportUseCase) {
        super();
    }

    public async execute(params: GetOwnerExpenseReportUseCase.Params): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) return this.error(result.value.code, result.value.toErrorDetails());
        return this.success(result.value);
    }
}
