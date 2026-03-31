import { ExtractProductsToExcelController } from '@/presentation/functions/extract-products-to-excel';
import { makeExtractProductsToExcelUseCase } from '@/main/factories/use-cases/functions/extract-products-to-excel';

export const makeExtractProductsToExcelController = () => {
    const useCase = makeExtractProductsToExcelUseCase();
    return new ExtractProductsToExcelController(useCase);
};

export const extractProductsToExcelController = makeExtractProductsToExcelController();
