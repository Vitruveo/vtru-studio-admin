import React from 'react';

import { Avatar, Box, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconCheck, IconHandOff, IconClock } from '@tabler/icons-react';
import { Stores } from '@/features/stores/types';

interface Props {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    active: boolean;
    username?: string;
    stores: Stores;
}

export default function StoresItem({ onClick, active, stores, username }: Props) {
    const theme = useTheme();

    const handleStatusIcon = () => {
        if (stores.status === 'active') return <IconCheck size="18" stroke={1.3} color="green" />;

        if (stores.status === 'inactive') return <IconHandOff size="18" stroke={1.3} />;

        return <IconClock size="18" stroke={1.3} />;
    };

    return (
        <ListItemButton sx={{ mb: 1 }} selected={active} onClick={onClick}>
            <ListItemAvatar>
                <Box position="relative">
                    <Avatar alt="" src="" sx={{ fontSize: 14 }}>
                        {username?.slice(0, 2).toUpperCase()}
                    </Avatar>
                </Box>
            </ListItemAvatar>
            <ListItemText>
                <Stack direction="row" gap="10px" alignItems="center">
                    <Box mr="auto">
                        <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
                            {stores.organization?.url}
                        </Typography>
                        <Box mr="auto" display="flex" alignItems="center">
                            {handleStatusIcon()}
                            <Typography variant="body2" noWrap color={theme.palette.grey[600]} sx={{ marginLeft: 0.5 }}>
                                {username || ''}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </ListItemText>
        </ListItemButton>
    );
}
