import { AfterReadPetsUseCase } from '@/domain/use-cases/entity-events/pets/after-read';
import { Translator } from '@/domain/utils/translator';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class AfterReadPetsController extends BaseControllerImpl {
    constructor(
        private readonly useCase: AfterReadPetsUseCase,
        private readonly translator: Translator
    ) {
        super();
    }

    public execute(params: AfterReadPetsUseCase.Params, language: string): BaseControllerResponse {
        const result = this.useCase.execute(params);
        if (result.isLeft()) {
            const err = result.value;
            const message = this.translator.translate(err.key, language, err.args);
            return this.error(result.value.code, [{ status: err.code, message, target: 'unknown' }]);
        }
        return this.success(result.value);
    }
}
