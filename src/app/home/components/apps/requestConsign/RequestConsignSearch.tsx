import React from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { IconSearch } from '@tabler/icons-react';

type Props = {
    search: string;
    setSearch(value: string): void;
};

export default function RequestConsignSearch({ search, setSearch }: Props) {
    return (
        <Box display="flex" sx={{ p: 2 }}>
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
        </Box>
    );
}
