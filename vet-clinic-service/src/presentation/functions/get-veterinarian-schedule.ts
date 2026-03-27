import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { BaseControllerImpl, BaseControllerResponse } from '../base/controller';

export class GetVeterinarianSchedule extends BaseControllerImpl {
    constructor(private readonly useCase: GetVeterinarianScheduleUseCase) {
        super();
    }

    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
