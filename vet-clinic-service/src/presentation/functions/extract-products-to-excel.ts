import { ExtractProductsToExcelUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { BaseControllerImpl, BaseControllerResponse } from '@/presentation/base/controller';

export class ExtractProductsToExcelController extends BaseControllerImpl {
    constructor(private readonly useCase: ExtractProductsToExcelUseCase) {
        super();
    }

    public async execute(): Promise<BaseControllerResponse> {
        const result = await this.useCase.execute();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.toErrorDetails());
        }
        return this.success(result.value);
    }
}
