// material
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { IconSearch } from '@tabler/icons-react';

export default function AssetSearch(props: Omit<TextFieldProps, 'variant'>) {
    return (
        <TextField
            id="outlined-search"
            placeholder="Search Asset..."
            size="small"
            type="search"
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconSearch size="14" />
                    </InputAdornment>
                ),
            }}
            fullWidth
            {...props}
        />
    );
}
