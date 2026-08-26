import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import PaletteIcon from '@mui/icons-material/Palette';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useTranslate } from '@/presentation/contexts/translate-context.js';
import { useThemeContext } from '@/presentation/contexts/theme-context.js';
import { ROUTES } from '@/shared/constants/routes.js';

const DRAWER_WIDTH = 240;

export function AppShell() {
    const translate = useTranslate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setDarkMode } = useThemeContext();
    const isDark = theme.darkMode === 'dark';

    const isActive = (p: string) => location.pathname === p || location.pathname.startsWith(p + '/');

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <Typography variant="h6" fontWeight={700} noWrap>vet-clinic</Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 1 }}>
                <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }} selected={location.pathname === ROUTES.HOME} onClick={() => navigate(ROUTES.HOME)}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary={translate('menu.home')} />
                </ListItemButton>
            </List>
            <Box sx={{ flex: 1 }} />
            <Divider />
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                <Typography variant="overline" color="text.secondary">{translate('menu.settings')}</Typography>
            </Box>
            <List sx={{ px: 1 }}>
                <ListItemButton sx={{ borderRadius: 1 }} selected={isActive(ROUTES.SETTINGS_THEME)} onClick={() => navigate(ROUTES.SETTINGS_THEME)}>
                    <ListItemIcon><PaletteIcon /></ListItemIcon>
                    <ListItemText primary={translate('menu.themeSettings')} />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }}>
            <AppBar position="fixed" sx={{ zIndex: (th) => th.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={600} noWrap sx={{ flex: 1 }}>vet-clinic</Typography>
                    <Tooltip title={isDark ? translate('theme.darkMode.light') : translate('theme.darkMode.dark')}>
                        <IconButton color="inherit" onClick={() => setDarkMode(isDark ? 'light' : 'dark')}>
                            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }} open>
                    {drawerContent}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
