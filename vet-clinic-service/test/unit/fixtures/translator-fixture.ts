import { Translator } from '@/domain/utils/translator';

export class TranslatorFixture implements Translator {
    private translations: Record<string, string> = {
        petNotFound: 'Pet not found',
        veterinarianNotFound: 'Veterinarian not found',
        emptyProceduresList: 'No procedures provided',
        ownerNotFound: 'Owner not found',
        owner_não_possui_agendamentos: 'No completed appointments found for this owner',
        Veterinario_não_encontrado: 'Veterinarian not found',
        Agendamentos_não_encontrados_neste_periodo: 'No appointments found in this period'
    };

    withTranslation(key: string, value: string): this {
        this.translations[key] = value;
        return this;
    }

    translate(key: string): string {
        return this.translations[key] || key;
    }

    withLanguage(language: string, fn: () => void): void {
        fn();
    }

    build(): Translator {
        return this;
    }
}

export const createDefaultTranslator = (): TranslatorFixture =>
    new TranslatorFixture();
