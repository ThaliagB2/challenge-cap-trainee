import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { ThemeConfig } from '@/infra/theme/theme-config.js';

export function buildMuiTheme(config: ThemeConfig): Theme {
    const isDark = config.darkMode === 'dark';

    return createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            primary: { main: config.colors.primary, light: config.colors.primaryLight, dark: config.colors.primaryDark },
            secondary: { main: config.colors.secondary, light: config.colors.secondaryLight, dark: config.colors.secondaryDark },
            error: { main: config.colors.error },
            warning: { main: config.colors.warning },
            success: { main: config.colors.success },
            info: { main: config.colors.info },
            ...(isDark ? {} : {
                background: { default: config.colors.background, paper: config.colors.surface },
                text: { primary: config.colors.textPrimary, secondary: config.colors.textSecondary },
                divider: config.colors.border
            })
        },
        typography: {
            fontFamily: config.typography.fontFamily,
            fontSize: parseInt(config.typography.baseFontSize) || 14
        },
        shape: { borderRadius: parseInt(config.layout.borderRadius) || 8 }
    });
}

export function themeToCustomProperties(config: ThemeConfig): string {
    const lines = [
        ':root {',
        ...Object.entries(config.colors).map(
            ([key, value]) => `  --color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
        ),
        `  --font-family: ${config.typography.fontFamily};`,
        `  --border-radius: ${config.layout.borderRadius};`,
        `  --header-height: ${config.layout.headerHeight};`,
        `  --sidebar-width: ${config.layout.sidebarWidth};`,
        '}'
    ];
    return lines.join('\n');
}
