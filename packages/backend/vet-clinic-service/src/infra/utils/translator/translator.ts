import { ResourceManager } from '@sap/textbundle';
import path from 'path';

import { Translator } from '@/domain/utils/translator';

export class TranslatorImpl implements Translator {
    private readonly resourceManager: ResourceManager;

    constructor() {
        this.resourceManager = new ResourceManager(path.join(__dirname, 'i18n', 'i18n'));
    }

    public translate(key: string, language: string, args?: string[] | undefined): string {
        const translatedLanguage = this.getTranslateLanguage(language);
        const bundle = this.resourceManager.getTextBundle(translatedLanguage);
        return bundle.getText(key, args);
    }

    private getTranslateLanguage(language: string) {
        if (language === 'pt' || language === 'pt-br') {
            return 'pt';
        }
        return 'en';
    }
}
