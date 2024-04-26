import React from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconStar, IconTrash } from '@tabler/icons-react';
import { CreatorType } from '@/features/creator';
import { useSelector } from 'react-redux';
import { websocketSelector } from '@/features/ws';

interface Props extends Omit<CreatorType, 'roles'> {
    onCreatorClick: (event: React.MouseEvent<HTMLElement>) => void;
    onStarredClick: React.MouseEventHandler<SVGElement>;
    onDeleteClick: React.MouseEventHandler<SVGElement>;
    image: string;
    active: any;
}

export default function CreatorListItem({
    onCreatorClick,
    onStarredClick,
    onDeleteClick,
    _id,
    name,
    emails,
    active,
}: Props) {
    const theme = useTheme();
    const warningColor = theme.palette.warning.main;

    const { creatorsOnline } = useSelector(websocketSelector(['creatorsOnline']));

    return (
        <ListItemButton sx={{ mb: 1 }} selected={active}>
            <ListItemAvatar>
                <Box position="relative">
                    <Avatar alt="" src="" sx={{ fontSize: 14 }}>
                        {(name || (emails?.length > 0 && emails[0].email) || '').slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box
                        position="absolute"
                        width="15px"
                        height="15px"
                        borderRadius="50%"
                        border="2px solid #fff"
                        bgcolor={creatorsOnline?.some((item) => item._id === _id) ? '#13DEB9' : '#f3704d'}
                        bottom={-3}
                        right={15}
                    ></Box>
                </Box>
            </ListItemAvatar>
            <ListItemText>
                <Stack direction="row" gap="10px" alignItems="center">
                    <Box mr="auto" onClick={onCreatorClick}>
                        <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
                            {name || (emails?.length > 0 && emails[0].email) || ''}
                        </Typography>
                    </Box>
                    <IconStar onClick={onStarredClick} size="16" stroke={1.5} />
                    <IconTrash onClick={onDeleteClick} size="16" stroke={1.5} />
                </Stack>
            </ListItemText>
        </ListItemButton>
    );
}
