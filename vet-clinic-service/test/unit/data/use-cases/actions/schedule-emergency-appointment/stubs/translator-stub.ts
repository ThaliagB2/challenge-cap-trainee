import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    private translations: Record<string, string> = {
        petNotFound: 'Pet not found',
        veterinarianNotFound: 'Veterinarian not found',
        noProceduresProvided: 'No procedures provided',
        petIsRequired: 'Pet is required',
        veterinarianIsRequired: 'Veterinarian is required'
    };

    public withLanguage(language: string, fn: () => void): void {
        fn();
    }

    public translate = (params: any): string => {
        const key = typeof params === 'string' ? params : params.text;
        return this.translations[key] || key;
    };
}

