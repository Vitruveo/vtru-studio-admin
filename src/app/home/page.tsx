'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/home/components/container/PageContainer';
import activeAssetsIcon from '../../../public/images/svgs/icon-dd-application.svg';
import userMaleIcon from '../../../public/images/svgs/icon-user-male.svg';
import mailBoxIcon from '../../../public/images/svgs/icon-mailbox.svg';
import { HomeCard } from './components/widgets/cards/home-card';

export default function Dashboard() {
    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
            <Box mt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={12}>
                        <Grid container spacing={3} mt={1}>
                            <HomeCard bgcolor="primary" icon={userMaleIcon} title="Creators" digits="96" />
                            <HomeCard bgcolor="secondary" icon={activeAssetsIcon} title="Active Assets" digits="96" />
                            <HomeCard bgcolor="info" icon={mailBoxIcon} title="Waiting for Approval" digits="96" />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}
