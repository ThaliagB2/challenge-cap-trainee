import { Translator } from '@/domain/utils/translator';

export class TranslatorStub implements Translator {
    public translate(key: string): string {
        const messages: Record<string, string> = {
            Veterinario_não_encontrado: 'Veterinarian not found',
            Agendamentos_não_encontrados_neste_periodo: 'No appointments found in this period'
        };

        return messages[key] || key;
    }

    public withLanguage(language: string, fn: () => void): void {
        fn();
    }
}
