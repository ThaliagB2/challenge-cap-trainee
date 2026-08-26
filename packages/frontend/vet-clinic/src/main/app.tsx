import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { translate } from '@/infra/i18n/index.js';
import { useThemeStore } from '@/infra/stores/theme-store.js';
import { TranslateContext } from '@/presentation/contexts/translate-context.js';
import { ThemeContext } from '@/presentation/contexts/theme-context.js';
import type { ThemeContextValue } from '@/presentation/contexts/theme-context.js';
import { AppShell } from '@/presentation/layouts/app-shell/app-shell.js';
import { ThemeSettingsPage } from '@/presentation/pages/settings/theme-settings.js';
import { ROUTES } from '@/shared/constants/routes.js';

function HomePage() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={700}>{translate('app.welcome')}</Typography>
        </Box>
    );
}

export function App() {
    const themeStore = useThemeStore() as unknown as ThemeContextValue;
    return (
        <TranslateContext.Provider value={translate}>
            <ThemeContext.Provider value={themeStore}>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppShell />}>
                            <Route path={ROUTES.HOME} element={<HomePage />} />
                            <Route path={ROUTES.SETTINGS_THEME} element={<ThemeSettingsPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeContext.Provider>
        </TranslateContext.Provider>
    );
}
