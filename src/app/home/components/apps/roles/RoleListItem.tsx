import React from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconStar, IconTrash } from '@tabler/icons-react';
import { Role } from '@/features/role/types';

interface Props extends Role {
    onRoleClick: (event: React.MouseEvent<HTMLElement>) => void;
    onStarredClick: React.MouseEventHandler<SVGElement>;
    onDeleteClick: React.MouseEventHandler<SVGElement>;
    active: any;
}

export default function RoleListItem({ onRoleClick, onStarredClick, onDeleteClick, name, description, active }: Props) {
    return (
        <ListItemButton sx={{ mb: 1 }} selected={active} onClick={onRoleClick}>
            <ListItemAvatar>
                <Avatar alt="" src="" sx={{ fontSize: 14 }}>
                    {name.slice(0, 2).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <ListItemText>
                <Stack direction="row" gap="10px" alignItems="center">
                    <Box mr="auto" onClick={onRoleClick}>
                        <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {description}
                        </Typography>
                    </Box>
                    <IconStar onClick={onStarredClick} size="16" stroke={1.5} />
                    <IconTrash onClick={onDeleteClick} size="16" stroke={1.5} />
                </Stack>
            </ListItemText>
        </ListItemButton>
    );
}
