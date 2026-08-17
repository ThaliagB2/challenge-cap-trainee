import { EmergencyAppointmentParams } from '@/domain/models/db/appointment';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions';
import { Translator } from '@/domain/utils/translator';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class ScheduleEmergencyAppointmentController extends BaseControllerImpl {
    constructor(
        private readonly useCase: ScheduleEmergencyAppointmentUseCase,
        private readonly translator: Translator
    ) {
        super();
    }

    public async execute(params: EmergencyAppointmentParams, language: string): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            const err = result.value;
            const message = this.translator.translate(err.key, language, err.args);
            return this.error(result.value.code, [{ status: err.code, message, target: 'unknown' }]);
        }
        return this.success(result.value);
    }
}
