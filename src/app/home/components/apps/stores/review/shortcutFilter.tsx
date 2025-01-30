import { Box, Typography } from '@mui/material';
import { shortcutsOptions } from './options';

interface ShortcutFilterProps {
    content: { [key: string]: boolean };
}

export const ShortcutFilter = ({ content }: ShortcutFilterProps) => {
    const isLast = (index: number) => index < Object.keys(content).length - 1;

    return (
        <Box display={'flex'} gap={1} flexWrap={'wrap'}>
            {Object.entries(content)
                .filter(([_key, value]) => !!value)
                .map(([key, _value], index) => (
                    <Typography key={key}>
                        {shortcutsOptions.find((item) => item.name === key)?.label}
                        {isLast(index) ? ', ' : ''}
                    </Typography>
                ))}
        </Box>
    );
};
