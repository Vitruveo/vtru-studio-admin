import { Grid, CardContent, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { Theme } from '@mui/material';

export interface HomeCardProps {
    bgcolor: keyof Theme['palette'];
    icon: string;
    title: string;
    digits: string;
}

export const HomeCard = ({ bgcolor, icon, title, digits }: HomeCardProps) => {
    return (
        <Grid item xs={12} sm={4} lg={2}>
            <Box bgcolor={bgcolor + '.light'} textAlign="center">
                <CardContent>
                    <Image src={icon} alt={'icon'} width="50" height="50" />
                    <Typography color={bgcolor + '.main'} mt={1} variant="subtitle1" fontWeight={600}>
                        {title}
                    </Typography>
                    <Typography color={bgcolor + '.main'} variant="h4" fontWeight={600}>
                        {digits}
                    </Typography>
                </CardContent>
            </Box>
        </Grid>
    );
};
