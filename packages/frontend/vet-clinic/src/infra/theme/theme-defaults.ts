import type { ThemeConfig } from '@/infra/theme/theme-config.js';

export const DEFAULT_THEME: ThemeConfig = {
    colors: {
        primary: '#2563eb',
        primaryLight: '#60a5fa',
        primaryDark: '#1e40af',
        secondary: '#7c3aed',
        secondaryLight: '#a78bfa',
        secondaryDark: '#6d28d9',
        background: '#f7f8fa',
        surface: '#ffffff',
        border: '#e4e7ec',
        error: '#e5484d',
        warning: '#f5a623',
        success: '#30a46c',
        info: '#0091ff',
        textPrimary: '#11181c',
        textSecondary: '#687076'
    },
    logos: { header: '', secondary: '', login: '', favicon: '' },
    typography: {
        fontFamily: 'DM Sans, sans-serif',
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
        baseFontSize: '14px'
    },
    layout: { borderRadius: '8px', headerHeight: '52px', sidebarWidth: '220px' },
    darkMode: 'light',
    customCss: ''
};
