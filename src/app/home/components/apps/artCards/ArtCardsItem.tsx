import React from 'react';

import { Avatar, Box, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconCheck, IconHandOff, IconClock } from '@tabler/icons-react';

// features
import { AssetType } from '@/app/home/types/apps/asset';

interface Props extends AssetType {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    image: string;
    active: any;
}

export default function ArtCardsItem({ onClick, creator, active, licenses, assetMetadata }: Props) {
    const theme = useTheme();

    const handleStatusIcon = () => {
        if (licenses.artCards.status === 'approved') return <IconCheck size="18" stroke={1.3} color="green" />;

        if (licenses.artCards.status === 'rejected') return <IconHandOff size="18" stroke={1.3} />;

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
                            {assetMetadata.context?.formData.title}
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
        </ListItemButton>
    );
}
