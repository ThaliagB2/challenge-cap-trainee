import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    public translate(key: string): string {
        const translations: Record<string, string> = {
            ownerIsRequired: 'Owner is required',
            ownerNotFound: 'Owner not found',
            noCompletedAppointmentsFoundForThisOwner: 'No completed appointments found for this owner'
        };

        return translations[key] || key;
    }

    public withLanguage(language: string, fn: () => void): void {
        fn();
    }
}

