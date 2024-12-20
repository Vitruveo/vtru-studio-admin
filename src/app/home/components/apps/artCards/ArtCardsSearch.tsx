import React from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { IconSearch } from '@tabler/icons-react';
import { IconButton, Tooltip } from '@mui/material';
import { RefreshRounded } from '@mui/icons-material';

type Props = {
    search: string | null;
    setSearch(value: string): void;
    handleRefresh(): void;
};

export default function ArtCardsSearch({ search, setSearch, handleRefresh }: Props) {
    return (
        <Box display="flex" gap={2} sx={{ p: 2 }}>
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
                placeholder="Search Requests"
                variant="outlined"
                onChange={(e) => setSearch(e.target.value)}
            />

            <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh}>
                    <RefreshRounded />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
