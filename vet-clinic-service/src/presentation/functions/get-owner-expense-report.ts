import { GetOwnerExpenseReportUsecase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { BaseControllerImpl, BaseControllerResponse } from '../base/controller';

export class GetOwnerExpenseReport extends BaseControllerImpl {
    constructor(private readonly useCase: GetOwnerExpenseReportUsecase) {
        super();
    }

    public async execute(ownerId: string): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(ownerId);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
    }
}
