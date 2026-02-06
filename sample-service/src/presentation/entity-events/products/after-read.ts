import { AfterReadProductsUseCase } from '@/domain/use-cases/entity-events/products';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class AfterReadProductsController extends BaseControllerImpl {
    constructor(private readonly useCase: AfterReadProductsUseCase) {
        super();
    }

    public execute(params: AfterReadProductsUseCase.Params): BaseControllerResponse {
        const result = this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
