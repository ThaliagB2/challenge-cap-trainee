import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class GetOwnerExpenseReportController extends BaseControllerImpl {
    constructor(private readonly useCase: GetOwnerExpenseReportUseCase) {
        super();
    }

    public async execute(params: GetOwnerExpenseReportUseCase.GetOwnerExpenseReportUseCasParams): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
