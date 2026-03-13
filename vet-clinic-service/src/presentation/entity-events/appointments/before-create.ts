import { BeforeCreateAppointmentUseCase } from '@/domain/use-cases/entity-events/appointments';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class BeforeCreateAppointmentsController extends BaseControllerImpl {
    constructor(private readonly useCase: BeforeCreateAppointmentUseCase) {
        super();
    }

    public async execute(params: BeforeCreateAppointmentUseCase.Params): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) return this.error(result.value.code, result.value.toErrorDetails());
        return this.success(result.value);
    }
}
