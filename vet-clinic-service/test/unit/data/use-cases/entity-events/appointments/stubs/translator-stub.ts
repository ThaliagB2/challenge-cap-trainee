import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    private translations: Record<string, string> = {
        petNotFound: 'Pet not found',
        veterinarianNotFound: 'Veterinarian not found',
        emptyProceduresList: 'No procedures provided'
    };

    public withTranslation(key: string, value: string): this {
        this.translations[key] = value;
        return this;
    }

    translate(key: string): string {
        return this.translations[key] || key;
    }

    withLanguage(language: string, fn: () => void): void {
        fn();
    }
}
