import { ExtractProductsToExcelUseCaseImpl } from '@/data/use-cases/functions/extract-products-to-excel';
import { ProductRepositoryImpl } from '@/infra/db/hana/repositories/procedures';
import { translator } from '@/main/factories/utils/translator';

export const makeExtractProductsToExcelUseCase = () => {
    const repository = new ProductRepositoryImpl();
    return new ExtractProductsToExcelUseCaseImpl(repository, translator);
};
