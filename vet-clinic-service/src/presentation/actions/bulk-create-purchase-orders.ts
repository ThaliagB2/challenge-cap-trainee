import { BulkCreatePurchaseOrdersUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class BulkCreatePurchaseOrdersController extends BaseControllerImpl {
    constructor(private readonly useCase: BulkCreatePurchaseOrdersUseCase) {
        super();
    }

    public async execute(params: BulkCreatePurchaseOrdersUseCase.Params): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
