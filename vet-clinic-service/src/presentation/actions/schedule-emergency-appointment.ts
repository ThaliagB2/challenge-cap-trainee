import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { BaseControllerImpl } from '../base/controller';

export class ScheduleEmergencyAppointmentController extends BaseControllerImpl {
    constructor(private readonly useCase: ScheduleEmergencyAppointmentUseCase) {
        super();
    }

    public async execute(params: ScheduleEmergencyAppointmentUseCase.Params) {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
