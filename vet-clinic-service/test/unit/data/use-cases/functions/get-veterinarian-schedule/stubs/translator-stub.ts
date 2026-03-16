import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    public translate(key: string): string {
        const translations: Record<string, string> = {
            veterinarianIsRequired: 'Veterinarian is required',
            veterinarianNotFound: 'Veterinarian not found',
            appointmentsNotFound: 'No appointments found for this veterinarian in the specified period'
        };

        return translations[key] || key;
    }

    public withLanguage(language: string, fn: () => void): void {
        fn();
    }
}

