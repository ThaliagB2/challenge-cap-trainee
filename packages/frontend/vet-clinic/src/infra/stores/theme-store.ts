import { create } from 'zustand';

import type { ThemeColorKey, ThemeConfig, ThemeLogoKey } from '@/infra/theme/theme-config.js';
import { DEFAULT_THEME } from '@/infra/theme/theme-defaults.js';

const STORAGE_KEY = 'app-theme';

interface ThemeStore {
    theme: ThemeConfig;
    isLoading: boolean;
    isDirty: boolean;
    loadTheme: () => Promise<void>;
    saveTheme: () => Promise<void>;
    resetTheme: () => void;
    updateColor: (key: ThemeColorKey, value: string) => void;
    updateLogo: (key: ThemeLogoKey, value: string) => void;
    updateTypography: (key: 'fontFamily' | 'fontUrl' | 'baseFontSize', value: string) => void;
    updateLayout: (key: 'borderRadius' | 'headerHeight' | 'sidebarWidth', value: string) => void;
    setDarkMode: (mode: 'light' | 'dark' | 'system') => void;
    setCustomCss: (css: string) => void;
    applyPreset: (colors: ThemeConfig['colors']) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    theme: { ...DEFAULT_THEME },
    isLoading: false,
    isDirty: false,

    loadTheme: async () => {
        set({ isLoading: true });
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) { set({ theme: { ...DEFAULT_THEME, ...JSON.parse(stored) }, isDirty: false }); }
        } finally {
            set({ isLoading: false });
        }
    },

    saveTheme: async () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(get().theme));
        set({ isDirty: false });
    },

    resetTheme: () => set({ theme: { ...DEFAULT_THEME }, isDirty: true }),

    updateColor: (key, value) => set((s) => ({ theme: { ...s.theme, colors: { ...s.theme.colors, [key]: value } }, isDirty: true })),
    updateLogo: (key, value) => set((s) => ({ theme: { ...s.theme, logos: { ...s.theme.logos, [key]: value } }, isDirty: true })),
    updateTypography: (key, value) => set((s) => ({ theme: { ...s.theme, typography: { ...s.theme.typography, [key]: value } }, isDirty: true })),
    updateLayout: (key, value) => set((s) => ({ theme: { ...s.theme, layout: { ...s.theme.layout, [key]: value } }, isDirty: true })),
    setDarkMode: (mode) => set((s) => ({ theme: { ...s.theme, darkMode: mode }, isDirty: true })),
    setCustomCss: (css) => set((s) => ({ theme: { ...s.theme, customCss: css }, isDirty: true })),
    applyPreset: (colors) => set((s) => ({ theme: { ...s.theme, colors: { ...colors } }, isDirty: true }))
}));
