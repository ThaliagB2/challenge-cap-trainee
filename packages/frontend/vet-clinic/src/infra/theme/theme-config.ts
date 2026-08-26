export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    background: string;
    surface: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    textPrimary: string;
    textSecondary: string;
}

export interface ThemeLogos {
    header: string;
    secondary: string;
    login: string;
    favicon: string;
}

export interface ThemeTypography {
    fontFamily: string;
    fontUrl: string;
    baseFontSize: string;
}

export interface ThemeLayout {
    borderRadius: string;
    headerHeight: string;
    sidebarWidth: string;
}

export interface ThemeConfig {
    colors: ThemeColors;
    logos: ThemeLogos;
    typography: ThemeTypography;
    layout: ThemeLayout;
    darkMode: 'light' | 'dark' | 'system';
    customCss: string;
}

export type ThemeColorKey = keyof ThemeColors;
export type ThemeLogoKey = keyof ThemeLogos;
