import { Box, Paper, Typography } from '@mui/material';

interface ColorFilterProps {
    content: string[];
}

export const ColorFilter = ({ content }: ColorFilterProps) => {
    return (
        <Box ml={1} display={'flex'} gap={1}>
            {content.map((item) => (
                <Box key={item} display={'flex'}>
                    <Paper
                        key={item}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: item,
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

interface ColorPrecisionFilterProps {
    content: { value: number };
}

export const ColorPrecisionFilter = ({ content }: ColorPrecisionFilterProps) => {
    return (
        <Typography variant="body1" ml={1}>
            {Number(content.value) * 100}%
        </Typography>
    );
};
