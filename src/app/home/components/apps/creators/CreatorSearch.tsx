import React from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { IconMenu2, IconSearch } from '@tabler/icons-react';

type Props = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;

  search: string;
  setSearch(value: string): void;
};

export default function CreatorSearch({ onClick, search, setSearch }: Props) {
  return (
    <Box display="flex" sx={{ p: 2 }}>
      <Fab
        onClick={onClick}
        color="primary"
        size="small"
        sx={{
          mr: 1,
          flexShrink: '0',
          display: { xs: 'block', lineHeight: '10px', lg: 'none' },
        }}>
        <IconMenu2 width="16" />
      </Fab>
      <TextField
        id="outlined-basic"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconSearch size={'16'} />
            </InputAdornment>
          ),
        }}
        fullWidth
        size="small"
        value={search}
        placeholder="Search Creators"
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>
  );
}
