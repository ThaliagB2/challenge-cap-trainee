import { BeforeCreatePurchaseOrderUseCase } from '@/domain/use-cases/entity-events/purchase-order';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class BeforeCreatePurchaseOrderController extends BaseControllerImpl {
    constructor(private readonly useCase: BeforeCreatePurchaseOrderUseCase) {
        super();
    }

    public async execute(params: BeforeCreatePurchaseOrderUseCase.Params): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
