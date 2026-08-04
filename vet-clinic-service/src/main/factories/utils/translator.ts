import { ResourceManager } from '@sap/textbundle';
import { AsyncLocalStorage } from 'async_hooks';

import { TranslatorImpl } from '@/infra/utils/translator/translator';

export const makeTranslator = () => {
    const resourceManager = new ResourceManager('../../../infra/utils/translator/i18n/i18n');
    return new TranslatorImpl(resourceManager, new AsyncLocalStorage());
};

export const translator = makeTranslator();
