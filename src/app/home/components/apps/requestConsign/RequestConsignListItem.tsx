import React from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconCheck, IconHandOff, IconClock, IconX, IconUserCheck, IconUserOff, IconBan } from '@tabler/icons-react';
import { RequestConsign } from '@/features/requestConsign';
import { CircularProgress } from '@mui/material';

interface Props extends RequestConsign {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    image: string;
    active: any;
}

export default function RequestConsignListItem({ onClick, creator, asset, active, status }: Props) {
    const theme = useTheme();

    const handleStatusIcon = () => {
        if (status === 'error') return <IconX size="18" stroke={1.3} color="red" />;

        if (status === 'running') return <CircularProgress size={18} thickness={5} color="inherit" />;

        if (status === 'approved') return <IconCheck size="18" stroke={1.3} color="green" />;

        if (status === 'rejected') return <IconHandOff size="18" stroke={1.3} />;

        if (status === 'canceled') return <IconBan size="18" stroke={1.3} />;

        return <IconClock size="18" stroke={1.3} />;
    };

    return (
        <ListItemButton sx={{ mb: 1 }} selected={active} onClick={onClick}>
            <ListItemAvatar>
                <Box position="relative">
                    <Avatar alt="" src="" sx={{ fontSize: 14 }}>
                        {creator?.username?.slice(0, 2).toUpperCase()}
                    </Avatar>
                </Box>
            </ListItemAvatar>
            <ListItemText>
                <Stack direction="row" gap="10px" alignItems="center">
                    <Box mr="auto">
                        <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
                            {asset?.title}
                        </Typography>
                        <Box mr="auto" display="flex" alignItems="center">
                            {handleStatusIcon()}
                            <Typography variant="body2" noWrap color={theme.palette.grey[600]} sx={{ marginLeft: 0.5 }}>
                                {creator?.username}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </ListItemText>
            <ListItemIcon>
                {creator.vault?.isBlocked && <IconUserOff />}
                {creator.vault?.isTrusted && <IconUserCheck />}
            </ListItemIcon>
        </ListItemButton>
    );
}
