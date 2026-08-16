import { TranslatorImpl } from '@/infra/utils/translator/translator';

export const makeTranslator = () => new TranslatorImpl();
export const translator = makeTranslator();
