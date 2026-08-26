import { createContext, useContext } from 'react';

export type ThemeColorKey =
    | 'primary' | 'primaryLight' | 'primaryDark'
    | 'secondary' | 'secondaryLight' | 'secondaryDark'
    | 'background' | 'surface' | 'border'
    | 'error' | 'warning' | 'success' | 'info'
    | 'textPrimary' | 'textSecondary';

export interface AppThemeConfig {
    darkMode: 'dark' | 'light';
    colors: Record<ThemeColorKey, string>;
    logos: { header: string; secondary: string; login: string; favicon: string };
    typography: { fontFamily: string; fontUrl: string; baseFontSize: string };
    layout: { borderRadius: string; headerHeight: string; sidebarWidth: string };
    customCss: string;
}

export interface ThemeContextValue {
    theme: AppThemeConfig;
    isDirty: boolean;
    setDarkMode: (mode: 'dark' | 'light') => void;
    saveTheme: () => Promise<void>;
    resetTheme: () => void;
    updateColor: (key: ThemeColorKey, value: string) => void;
    updateLogo: (key: keyof AppThemeConfig['logos'], value: string) => void;
    updateTypography: (key: keyof AppThemeConfig['typography'], value: string) => void;
    updateLayout: (key: keyof AppThemeConfig['layout'], value: string) => void;
    setCustomCss: (css: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useThemeContext = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useThemeContext must be used inside ThemeContext.Provider');
    }
    return ctx;
};
