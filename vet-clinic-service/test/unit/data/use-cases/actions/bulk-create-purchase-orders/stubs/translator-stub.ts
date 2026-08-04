import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    private translations: Record<string, string> = {
        // Mensagens de sucesso
        purchaseOrdersCreatedSuccessfully: 'Purchase orders created successfully',

        // Mensagens de erro
        noPurchaseOrdersProvided: 'No purchase orders provided',
        noProductsFound: 'No products found',
        specificProductsNotFound: 'Products not found: {0}',
        purchaseOrder: 'Purchase order',

        // Mensagens de validação do modelo - chaves que correspondem ao PurchaseOrderModel
        dateIsRequired: 'Date is required',
        dateMustHaveAtMost10Characters: 'Date must not exceed 10 characters',
        itemsAreRequired: 'Items are required',
        productIsRequired: 'Product ID is required',
        quantityIsRequired: 'Quantity is required',
        priceIsRequired: 'Price is required',
        totalMustBeGreaterThanZero: 'Total must be greater than zero'
    };

    public withLanguage(language: string, fn: () => void): void {
        fn();
    }

    public translate(params: string | { text: string; args?: string }): string {
        if (typeof params === 'string') {
            return this.translations[params] || params;
        }

        let translation = this.translations[params.text] || params.text;

        if (params.args) {
            translation = translation.replace('{0}', params.args);
        }

        return translation;
    }

    public setTranslation(key: string, value: string): void {
        this.translations[key] = value;
    }
}
