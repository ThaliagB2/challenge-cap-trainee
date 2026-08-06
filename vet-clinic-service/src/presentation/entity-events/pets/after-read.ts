import { AfterReadPetsUseCase } from "@/domain/use-cases/entity-events/pets/after-read";
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class AfterReadPetsController extends BaseControllerImpl{
    constructor(private readonly useCase: AfterReadPetsUseCase) {
        super();
    }

    public execute(params: AfterReadPetsUseCase.Params): BaseControllerResponse {
        const result = this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}