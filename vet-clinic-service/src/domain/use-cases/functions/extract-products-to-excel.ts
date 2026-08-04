import { Either } from '@sweet-monads/either';
import ExcelJS from 'exceljs';

import { AbstractError } from '@/domain/errors';

export interface ExtractProductsToExcelUseCase {
    execute(): Promise<ExtractProductsToExcelUseCase.Result>;
}

export namespace ExtractProductsToExcelUseCase {
    export type Result = Either<AbstractError, ExcelJS.Buffer>;
}
