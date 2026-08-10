import { EmergencyAppointmentParams } from "@/domain/models/db/appointment";
import { ScheduleEmergencyAppointmentUseCase } from "@/domain/use-cases/actions";
import { BaseControllerImpl, BaseControllerResponse } from "@/presentation/base/controller";

export class ScheduleEmergencyAppointmentController extends BaseControllerImpl {
    constructor( private readonly useCase: ScheduleEmergencyAppointmentUseCase){
        super();
    }

    public async execute(params: EmergencyAppointmentParams): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}