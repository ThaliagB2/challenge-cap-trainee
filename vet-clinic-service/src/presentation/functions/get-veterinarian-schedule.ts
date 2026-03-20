import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { BaseControllerImpl, BaseControllerResponse } from '../base/controller';

export class GetVeterinarianSchedule extends BaseControllerImpl {
    constructor(public readonly useCase: GetVeterinarianScheduleUseCase) {
        super();
    }

    public async execute(veterinarianId: string, days: number): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(veterinarianId, days);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
