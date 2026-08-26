import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/infra/i18n/index.js';
import { ThemeAppProvider } from '@/infra/theme/theme-provider.js';
import { App } from '@/main/app.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeAppProvider>
            <App />
        </ThemeAppProvider>
    </React.StrictMode>
);
