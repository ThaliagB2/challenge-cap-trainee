import { AfterReadPetUseCase } from '@/domain/use-cases/entity-events/pets';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class AfterReadPetsController extends BaseControllerImpl {
    constructor(private readonly useCase: AfterReadPetUseCase) {
        super();
    }

    public async execute(params: AfterReadPetUseCase.Params): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
