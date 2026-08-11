import { GetVeterinarianScheduleItemUseCase } from '@/domain/use-cases/functions';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class GetVeterinarianScheduleItemController extends BaseControllerImpl {
    constructor(private readonly useCase: GetVeterinarianScheduleItemUseCase) {
        super();
    }

    public async execute(params: GetVeterinarianScheduleItemUseCase.GetVeterinarianScheduleItemUseCaseParams): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
