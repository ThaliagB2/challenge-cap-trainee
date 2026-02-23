import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { BaseControllerImpl, BaseControllerResponse } from '../base/controller';

export class GetOwnerExpenseReportController extends BaseControllerImpl {
    constructor(private readonly useCase: GetOwnerExpenseReportUseCase) {
        super();
    }

    public async execute(ownerId: string): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(ownerId);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
