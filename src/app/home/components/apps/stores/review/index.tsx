import { Box, Grid } from '@mui/material';
import { SelectedFilter } from './selectedFilterSection';
import { Artworks } from '@/features/stores/types';

interface Props {
    values: Artworks;
}
export const Review = ({ values }: Props) => {
    return (
        <Box>
            <Grid container spacing={4}>
                {Object.entries(values).map((element) => {
                    const [key, rawValue] = element;
                    let value = rawValue;
                    if (typeof value !== 'object') value = { [`${key}`]: [value] };
                    return <SelectedFilter key={key} title={key} content={value} />;
                })}
            </Grid>
        </Box>
    );
};
