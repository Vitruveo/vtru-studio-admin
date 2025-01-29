import { Box, Paper, Typography } from '@mui/material';
import { shortcutsOptions } from './options';

interface ShortcutFilterProps {
    content: { [key: string]: boolean };
}

export const ShortcutFilter = ({ content }: ShortcutFilterProps) => {
    return (
        <Box display={'flex'} gap={1} flexWrap={'wrap'}>
            {Object.entries(content)
                .filter(([_key, value]) => !!value)
                .map(([key, _value]) => (
                    <Paper key={key} sx={{ padding: 1, display: 'flex' }}>
                        <Typography>{shortcutsOptions.find((item) => item.name === key)?.label}</Typography>
                    </Paper>
                ))}
        </Box>
    );
};
