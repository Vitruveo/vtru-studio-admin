import { Box, Checkbox, Grid, Typography, Paper, Button } from '@mui/material';

interface Props {
    color: string;
}

const FilterMock = ({ color }: Props) => {
    return (
        <Box width="100%" height="100%" bgcolor="#eeeeee" display={'flex'} flexDirection={'column'} gap={4}>
            <Grid container spacing={2}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <Grid item xs={6} key={index}>
                        <Box display="flex" alignItems="center">
                            <Checkbox
                                checked={index % 2 === 0}
                                sx={{
                                    '&.Mui-checked': {
                                        color: color,
                                    },
                                }}
                            />
                            <Typography variant="body2">----</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Grid container sx={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Grid item xs={12} key={index} sx={{ border: '1px solid gray', padding: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent={'space-between'} paddingInline={2}>
                            <Typography variant="body2">----</Typography>
                            {index < 2 && (
                                <Paper
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        bgColor: 'red',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        backgroundColor: color,
                                        color: 'white',
                                    }}
                                >
                                    2
                                </Paper>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Grid container>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: color, '&:hover': { backgroundColor: color } }}
                >
                    Reset filters
                </Button>
            </Grid>
        </Box>
    );
};

export default FilterMock;
