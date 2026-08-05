import { ResourceManager } from '@sap/textbundle';
import { AsyncLocalStorage } from 'async_hooks';

import { Translator } from '@/domain/utils/translator';

export class TranslatorImpl implements Translator {
    constructor(
        private readonly resourceManager: ResourceManager,
        private readonly asyncLocalStorage: AsyncLocalStorage<{ language: string }>
    ) {}

    public withLanguage(language: string, fn: () => void) {
        return this.asyncLocalStorage.run({ language }, fn);
    }

    public translate(params: any) {
        if (typeof params === 'object' && params.language) {
            const { language, text, args } = params;
            const translatedLanguage = this.getTranslateLanguage(language);
            const bundle = this.resourceManager.getTextBundle(translatedLanguage);
            return bundle.getText(text, args);
        }

        const text = typeof params === 'string' ? params : params.text;
        // eslint-disable-next-line prefer-rest-params
        const args = typeof params === 'string' ? arguments[1] : params.args;

        const language = this.getCurrentLanguage();
        const translatedLanguage = this.getTranslateLanguage(language);
        const bundle = this.resourceManager.getTextBundle(translatedLanguage);
        return bundle.getText(text, args);
    }

    private getCurrentLanguage() {
        const context = this.asyncLocalStorage.getStore();
        return context?.language || 'en-En';
    }

    private getTranslateLanguage(language: string) {
        if (language === 'pt' || language === 'pt-BR') {
            return 'pt-BR';
        }
        return 'en-En';
    }
}
