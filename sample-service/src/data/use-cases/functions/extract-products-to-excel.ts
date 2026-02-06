import { left, right } from '@sweet-monads/either';
import ExcelJS from 'exceljs';

import { NotFoundError, ServerError } from '@/domain/errors';
import { ProductProps } from '@/domain/models/db/product';
import { ProductRepository } from '@/domain/repositories';
import { ExtractProductsToExcelUseCase } from '@/domain/use-cases/functions/extract-products-to-excel';
import { Translator } from '@/domain/utils/translator';

export class ExtractProductsToExcelUseCaseImpl implements ExtractProductsToExcelUseCase {
    constructor(
        private readonly repository: ProductRepository,
        private readonly translator: Translator
    ) {}

    public async execute(): Promise<ExtractProductsToExcelUseCase.Result> {
        try {
            const products = await this.repository.findAll();
            if (!products) {
                const message = this.translator.translate('noProductsFound');
                return left(new NotFoundError(message));
            }
            const formattedProducts = products?.map((product) => product.toObject());
            const excelBuffer = await this.generateExcelBuffer(formattedProducts);
            return right(excelBuffer);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async generateExcelBuffer(data: ProductProps[]): Promise<ExcelJS.Buffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sales Report System';
        workbook.lastModifiedBy = 'Sales Report Exporter';
        workbook.created = new Date();
        workbook.modified = new Date();

        const productsLabel = this.translator.translate({ text: 'products', args: [data.length] });
        const worksheet = workbook.addWorksheet(productsLabel);
        this.configureWorksheetColumns(worksheet);
        worksheet.addRows(data);

        this.applyFormatting(worksheet);

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    private configureWorksheetColumns(worksheet: ExcelJS.Worksheet): void {
        const nameLabel = this.translator.translate({ text: 'name' });
        const priceLabel = this.translator.translate({ text: 'price' });
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 36 },
            { header: nameLabel, key: 'name', width: 30 },
            { header: priceLabel, key: 'price', width: 15 }
        ];
    }

    private applyFormatting(worksheet: ExcelJS.Worksheet): void {
        worksheet.getRow(1).font = { bold: true };

        const totalAmountColumn = worksheet.getColumn('price');
        totalAmountColumn.numFmt = '"R$"#,##0.00';
    }
}
