import { createContext, useContext } from 'react';

export type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

export const TranslateContext = createContext<TranslateFn>((key) => key);

export const useTranslate = (): TranslateFn => useContext(TranslateContext);
