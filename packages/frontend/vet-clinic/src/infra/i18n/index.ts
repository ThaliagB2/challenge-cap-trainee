import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '@/infra/i18n/en.json';
import ptBR from '@/infra/i18n/pt-br.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { 'pt-BR': { translation: ptBR }, 'en': { translation: en } },
        fallbackLng: 'pt-BR',
        interpolation: { escapeValue: false }
    });

export const translate = (key: string, options?: Record<string, unknown>): string =>
    i18n.t(key, options) as string;

export { i18n };
