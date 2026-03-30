import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    public translate(key: string): string {
        const translations: Record<string, string> = {
            ownerNotFound: 'Owner not found',
            owner_não_possui_agendamentos: 'No completed appointments found for this owner'
        };

        return translations[key] || key;
    }

    public withLanguage(language: string, fn: () => void): void {
        fn();
    }
}
