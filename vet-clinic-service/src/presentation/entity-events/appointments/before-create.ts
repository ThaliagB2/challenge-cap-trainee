import { BeforeCreateAppointmentUseCases } from "@/domain/use-cases/entity-events/appointments/before-create";
import { BaseControllerImpl, BaseControllerResponse } from "@/presentation/base/controller";

export class BeforeCreateAppointmentController extends BaseControllerImpl {
    constructor(private readonly useCase: BeforeCreateAppointmentUseCases){
        super();
    }

    public async execute(params: BeforeCreateAppointmentUseCases.BeforeCreateParams): Promise <BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if(result.isLeft()){
            return this.error(result.value.code, result.value.toErrorDetails())
        }
        return this.success(result.value);
    }
}