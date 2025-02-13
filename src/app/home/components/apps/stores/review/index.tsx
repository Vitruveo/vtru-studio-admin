import { Box, Card, Grid } from '@mui/material';
import { SelectedFilter } from './selectedFilterSection';
import { Artworks } from '@/features/stores/types';

interface Props {
    values: Artworks;
}
export const Review = ({ values }: Props) => {
    return (
        <Box>
            <Card sx={{ padding: 2 }}>
                <Grid container spacing={4}>
                    {Object.entries(values).map((element) => {
                        const [key, value] = element;
                        return <SelectedFilter key={key} title={key} content={value} />;
                    })}
                </Grid>
            </Card>
        </Box>
    );
};
