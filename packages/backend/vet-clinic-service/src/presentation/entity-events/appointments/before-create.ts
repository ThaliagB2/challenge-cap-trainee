import { BeforeCreateAppointmentUseCases } from '@/domain/use-cases/entity-events/appointments/before-create';
import { Translator } from '@/domain/utils/translator';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class BeforeCreateAppointmentController extends BaseControllerImpl {
    constructor(
        private readonly useCase: BeforeCreateAppointmentUseCases,
        private readonly translator: Translator
    ) {
        super();
    }

    public async execute(params: BeforeCreateAppointmentUseCases.BeforeCreateParams, language: string): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute(params);
        if (result.isLeft()) {
            const err = result.value;
            const message = this.translator.translate(err.key, language, err.args);
            return this.error(result.value.code, [{ status: err.code, message, target: 'unknown' }]);
        }
        return this.success(result.value);
    }
}
