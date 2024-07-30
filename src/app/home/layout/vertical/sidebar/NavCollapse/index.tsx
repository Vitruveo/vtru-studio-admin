import React from 'react';

import { useState } from 'react';
import { useSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';

// mui imports
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

// custom imports
import NavItem from '../NavItem';
import { isNull } from 'lodash';

// plugins
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

type NavGroupProps = {
    [x: string]: any;
    navlabel?: boolean;
    subheader?: string;
    title?: string;
    icon?: any;
    href?: any;
};

interface NavCollapseProps {
    menu: NavGroupProps;
    level: number;
    pathWithoutLastPart: any;
    pathDirect: any;
    hideMenu: any;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

// FC Component For Dropdown Menu
export default function NavCollapse({
    menu,
    level,
    pathWithoutLastPart,
    pathDirect,
    hideMenu,
    onClick,
}: NavCollapseProps) {
    const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

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
    const Icon = menu?.icon;
    const theme = useTheme();
    const pathname = usePathname();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const menuIcon = level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

    const handleClick = () => {
        setOpen(!open);
    };

    // menu collapse for sub-levels
    React.useEffect(() => {
        setOpen(false);
        menu?.children?.forEach((item: any) => {
            if (item?.href === pathname) {
                setOpen(true);
            }
        });
    }, [pathname, menu.children]);

    const ListItemStyled = styled(ListItemButton)(() => ({
        marginBottom: '2px',
        padding: '8px 10px',
        paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
        },
        color: theme.palette.text.secondary,
        borderRadius: `${customizer.borderRadius}px`,
    }));

    // If Menu has Children
    const submenus = menu.children?.map((item: any) => {
        if (item.children) {
            return (
                <NavCollapse
                    key={item?.id}
                    menu={item}
                    level={level + 1}
                    pathWithoutLastPart={pathWithoutLastPart}
                    pathDirect={pathDirect}
                    hideMenu={hideMenu}
                    onClick={onClick}
                />
            );
        } else {
            return (
                <Box
                    sx={{
                        marginLeft: 3,
                    }}
                    key={item.id}
                >
                    <NavItem
                        item={item}
                        level={level}
                        pathDirect={pathDirect}
                        hideMenu={hideMenu}
                        onClick={lgDown ? onClick : isNull}
                    />
                </Box>
            );
        }
    });

    return (
        <>
            <ListItemStyled onClick={handleClick} selected={pathWithoutLastPart === menu.href} key={menu?.id}>
                <ListItemIcon
                    sx={{
                        minWidth: '36px',
                        p: '3px 0',
                        color: 'inherit',
                    }}
                >
                    {menuIcon}
                </ListItemIcon>
                <ListItemText>{hideMenu ? '' : <>{t(`${menu.title}`)}</>}</ListItemText>
                {!open ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
            </ListItemStyled>
            <Collapse in={open} timeout="auto">
                {submenus}
            </Collapse>
        </>
    );
}
