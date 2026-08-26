import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { useThemeStore } from '@/infra/stores/theme-store.js';
import { buildMuiTheme, themeToCustomProperties } from '@/infra/theme/theme-utils.js';

interface ThemeAppProviderProps { children: ReactNode }

export function ThemeAppProvider({ children }: ThemeAppProviderProps) {
    const { theme, loadTheme } = useThemeStore();
    const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

    useEffect(() => { loadTheme(); }, [loadTheme]);

    useEffect(() => {
        if (theme.darkMode !== 'system') { return; }
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => setResolvedMode(mql.matches ? 'dark' : 'light');
        handler();
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [theme.darkMode]);

    const muiTheme = useMemo(() => {
        const effectiveConfig = theme.darkMode === 'system'
            ? { ...theme, darkMode: resolvedMode as 'light' | 'dark' }
            : theme;
        return buildMuiTheme(effectiveConfig);
    }, [theme, resolvedMode]);

    useEffect(() => {
        const css = themeToCustomProperties(theme);
        let style = document.getElementById('theme-custom-properties');
        if (!style) {
            style = document.createElement('style');
            style.id = 'theme-custom-properties';
            document.head.appendChild(style);
        }
        style.textContent = css;
        if (theme.customCss) {
            let custom = document.getElementById('theme-custom-css');
            if (!custom) {
                custom = document.createElement('style');
                custom.id = 'theme-custom-css';
                document.head.appendChild(custom);
            }
            custom.textContent = theme.customCss;
        }
    }, [theme]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <GlobalStyles styles={{ html: { overflowX: 'hidden' }, body: { overflowX: 'hidden' } }} />
            {children}
        </ThemeProvider>
    );
}
