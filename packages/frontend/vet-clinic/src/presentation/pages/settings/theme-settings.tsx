import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';

import { useTranslate } from '@/presentation/contexts/translate-context.js';
import type { ThemeColorKey } from '@/presentation/contexts/theme-context.js';
import { useThemeContext } from '@/presentation/contexts/theme-context.js';

interface SectionProps { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }

function Section({ title, open, onToggle, children }: SectionProps) {
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <ButtonBase onClick={onToggle} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 0.5, borderRadius: 1, width: '100%', '&:hover': { bgcolor: 'action.hover' } }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{title}</Typography>
                {open ? <ExpandLessIcon fontSize="small" sx={{ color: 'text.secondary' }} /> : <ExpandMoreIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
            </ButtonBase>
            <Collapse in={open}>{children}</Collapse>
        </Box>
    );
}

function ColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
            <Box sx={{ position: 'relative', width: 34, height: 34, borderRadius: '8px', bgcolor: value, border: '2px solid', borderColor: 'rgba(128,128,128,0.1)', flexShrink: 0, cursor: 'pointer' }}>
                <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ position: 'absolute', inset: -4, width: '140%', height: '140%', opacity: 0, cursor: 'pointer' }} />
            </Box>
            <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{label}</Typography>
            <Box component="input" type="text" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} spellCheck={false}
                sx={{ width: 82, py: '3px', px: '7px', fontSize: 11, fontFamily: 'monospace', bgcolor: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.1)', borderRadius: '5px', color: 'text.secondary', outline: 'none', textAlign: 'center' }} />
        </Box>
    );
}

export function ThemeSettingsPage() {
    const { theme, isDirty, saveTheme, resetTheme, updateColor, updateLogo, updateTypography, updateLayout, setCustomCss } = useThemeContext();
    const translate = useTranslate();
    const [saved, setSaved] = useState(false);
    const [openSections, setOpenSections] = useState({
        mainColors: true,
        bgColors: false,
        statusColors: false,
        textColors: false,
        logos: false,
        typography: false,
        layout: false,
        customCss: false
    });
    type SectionKey = keyof typeof openSections;
    const toggleSection = useCallback((key: SectionKey) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] })), []);

    const handleSave = async () => { await saveTheme(); setSaved(true); setTimeout(() => setSaved(false), 2200); };
    const colorRows = (keys: Array<[ThemeColorKey, string]>) => keys.map(([key, labelKey]) => (
        <ColorSwatch key={key} label={translate(labelKey)} value={theme.colors[key]} onChange={(v) => updateColor(key, v)} />
    ));

    return (
        <Box sx={{ p: '22px 28px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.3 }}>{translate('theme.title')}</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{translate('theme.subtitle')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={resetTheme} sx={{ textTransform: 'none', fontSize: 12 }}>{translate('theme.reset')}</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!isDirty && !saved} color={saved ? 'success' : 'primary'} sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600, px: 2.5 }}>
                        {saved ? translate('theme.saved') : translate('theme.save')}
                    </Button>
                </Box>
            </Box>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: '12px', border: 1, borderColor: 'divider', px: 2.25, py: 0.75, maxWidth: 400 }}>
                <Section title={translate('theme.sections.mainColors')} open={openSections.mainColors} onToggle={() => toggleSection('mainColors')}>
                    <Box sx={{ pb: 1 }}>{colorRows([['primary', 'theme.colors.primary'], ['primaryLight', 'theme.colors.primaryLight'], ['primaryDark', 'theme.colors.primaryDark'], ['secondary', 'theme.colors.secondary']])}</Box>
                </Section>
                <Section title={translate('theme.sections.bgColors')} open={openSections.bgColors} onToggle={() => toggleSection('bgColors')}>
                    <Box sx={{ pb: 1 }}>{colorRows([['background', 'theme.colors.background'], ['surface', 'theme.colors.surface'], ['border', 'theme.colors.border']])}</Box>
                </Section>
                <Section title={translate('theme.sections.statusColors')} open={openSections.statusColors} onToggle={() => toggleSection('statusColors')}>
                    <Box sx={{ pb: 1 }}>{colorRows([['error', 'theme.colors.error'], ['warning', 'theme.colors.warning'], ['success', 'theme.colors.success'], ['info', 'theme.colors.info']])}</Box>
                </Section>
                <Section title={translate('theme.sections.logos')} open={openSections.logos} onToggle={() => toggleSection('logos')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1 }}>
                        {(['header', 'secondary', 'login', 'favicon'] as const).map((key) => (
                            <TextField key={key} label={translate(`theme.logos.${key}`)} value={theme.logos[key]} onChange={(e) => updateLogo(key, e.target.value)} size="small" fullWidth />
                        ))}
                    </Box>
                </Section>
                <Section title={translate('theme.sections.typography')} open={openSections.typography} onToggle={() => toggleSection('typography')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1 }}>
                        <TextField label={translate('theme.typography.fontFamily')} value={theme.typography.fontFamily} onChange={(e) => updateTypography('fontFamily', e.target.value)} size="small" fullWidth />
                        <TextField label={translate('theme.typography.fontUrl')} value={theme.typography.fontUrl} onChange={(e) => updateTypography('fontUrl', e.target.value)} size="small" fullWidth />
                        <TextField label={translate('theme.typography.baseFontSize')} value={theme.typography.baseFontSize} onChange={(e) => updateTypography('baseFontSize', e.target.value)} size="small" fullWidth />
                    </Box>
                </Section>
                <Section title={translate('theme.sections.layout')} open={openSections.layout} onToggle={() => toggleSection('layout')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1 }}>
                        <TextField label={translate('theme.layout.borderRadius')} value={theme.layout.borderRadius} onChange={(e) => updateLayout('borderRadius', e.target.value)} size="small" fullWidth />
                        <TextField label={translate('theme.layout.headerHeight')} value={theme.layout.headerHeight} onChange={(e) => updateLayout('headerHeight', e.target.value)} size="small" fullWidth />
                        <TextField label={translate('theme.layout.sidebarWidth')} value={theme.layout.sidebarWidth} onChange={(e) => updateLayout('sidebarWidth', e.target.value)} size="small" fullWidth />
                    </Box>
                </Section>
                <Section title={translate('theme.sections.customCss')} open={openSections.customCss} onToggle={() => toggleSection('customCss')}>
                    <Box sx={{ pb: 1 }}>
                        <TextField value={theme.customCss} onChange={(e) => setCustomCss(e.target.value)} multiline rows={6} fullWidth size="small" />
                    </Box>
                </Section>
            </Box>
        </Box>
    );
}
