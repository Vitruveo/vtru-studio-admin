import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { IconMenu2 } from '@tabler/icons-react';
import Profile from '../../vertical/header/Profile';
import Language from '../../vertical/header/Language';
import Navigation from '../../vertical/header/Navigation';
import Logo from '../../shared/logo/Logo';

const Header = () => {
    const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    // drawer
    const customizer = {
        activeDir: 'ltr',
        activeMode: 'light', // This can be light or dark
        activeTheme: 'BLUE_THEME', // BLUE_THEME, GREEN_THEME, BLACK_THEME, PURPLE_THEME, ORANGE_THEME
        SidebarWidth: 270,
        MiniSidebarWidth: 87,
        TopbarHeight: 70,
        isLayout: 'full', // This can be full or boxed
        isCollapse: false, // to make sidebar Mini by default
        isSidebarHover: false,
        isMobileSidebar: false,
        isHorizontal: false,
        isLanguage: 'en',
        isCardShadow: true,
        borderRadius: 7,
    };

    const AppBarStyled = styled(AppBar)(({ theme }) => ({
        background: theme.palette.background.paper,
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',

        [theme.breakpoints.up('lg')]: {
            minHeight: customizer.TopbarHeight,
        },
    }));
    const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
        margin: '0 auto',
        width: '100%',
        color: `${theme.palette.text.secondary} !important`,
    }));

    return (
        <AppBarStyled position="sticky" color="default" elevation={8}>
            <ToolbarStyled
                sx={{
                    maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
                }}
            >
                <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
                    <Logo />
                </Box>
                {/* ------------------------------------------- */}
                {/* Toggle Button Sidebar */}
                {/* ------------------------------------------- */}
                {lgDown ? (
                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        // onClick={() => dispatch(toggleMobileSidebar())}
                    >
                        <IconMenu2 />
                    </IconButton>
                ) : (
                    ''
                )}
                {/* ------------------------------------------- */}
                {/* Search Dropdown */}
                {/* ------------------------------------------- */}

                {lgUp ? (
                    <>
                        <Navigation />
                    </>
                ) : null}
                <Box flexGrow={1} />
                <Stack spacing={1} direction="row" alignItems="center">
                    <Language />
                    {/* ------------------------------------------- */}
                    {/* Ecommerce Dropdown */}
                    {/* ------------------------------------------- */}

                    {/* ------------------------------------------- */}
                    {/* End Ecommerce Dropdown */}
                    {/* ------------------------------------------- */}

                    <Profile />
                </Stack>
            </ToolbarStyled>
        </AppBarStyled>
    );
};

export default Header;
