import React from 'react';

import Box from '@mui/material/Box';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconTrash } from '@tabler/icons-react';

interface Props {
    onFeatureClick: (event: React.MouseEvent<HTMLElement>) => void;
    onDeleteClick: React.MouseEventHandler<SVGElement>;
    image: string;
    name: string;
    active: any;
}

export default function RoleListItem({ onFeatureClick, onDeleteClick, name, active }: Props) {
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
    const br = `${customizer.borderRadius}px`;

    const theme = useTheme();

    const warningColor = theme.palette.warning.main;

    return (
        <Box display="flex" alignItems="center">
            <ListItemButton onClick={onFeatureClick} sx={{ mb: 1 }} selected={active}>
                <ListItemText>
                    <Stack direction="row" gap="10px" alignItems="center">
                        <Box mr="auto">
                            <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '240px' }}>
                                {name}
                            </Typography>
                        </Box>
                    </Stack>
                </ListItemText>
                <IconTrash
                    onClick={(event) => {
                        event.stopPropagation();
                        onDeleteClick(event);
                    }}
                    size="16"
                    stroke={1.5}
                />
            </ListItemButton>
        </Box>
    );
}
