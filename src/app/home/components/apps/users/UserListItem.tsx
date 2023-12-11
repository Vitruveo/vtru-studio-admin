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
import { UserType } from '@/mock/users';

interface Props extends Omit<UserType, 'roles'> {
  onUserClick: (event: React.MouseEvent<HTMLElement>) => void;
  onStarredClick: React.MouseEventHandler<SVGElement>;
  onDeleteClick: React.MouseEventHandler<SVGElement>;
  image: string;
  active: any;
}

export default function UserListItem({
  onUserClick,
  onStarredClick,
  onDeleteClick,
  name,
  login,
  image,
  active,
}: Props) {
  const theme = useTheme();
  const warningColor = theme.palette.warning.main;

  return (
    <ListItemButton sx={{ mb: 1 }} selected={active}>
      <ListItemAvatar>
        <Avatar alt="" src="" sx={{ fontSize: 14 }}>
          {(name || login.email).slice(0, 2).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText>
        <Stack direction="row" gap="10px" alignItems="center">
          <Box mr="auto" onClick={onUserClick}>
            <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
              {name || login.email}
            </Typography>
          </Box>
          <IconStar onClick={onStarredClick} size="16" stroke={1.5} />
          <IconTrash onClick={onDeleteClick} size="16" stroke={1.5} />
        </Stack>
      </ListItemText>
    </ListItemButton>
  );
}
