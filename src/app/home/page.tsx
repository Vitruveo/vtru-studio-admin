'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/home/components/container/PageContainer';
import activeAssetsIcon from '../../../public/images/svgs/icon-dd-application.svg';
import userMaleIcon from '../../../public/images/svgs/icon-user-male.svg';
import mailBoxIcon from '../../../public/images/svgs/icon-mailbox.svg';
import { HomeCard, HomeCardProps } from './components/widgets/cards/home-card';
import { useSelector } from '@/store/hooks';

export default function Dashboard() {
    const activeAssetsCount = useSelector((state) => state.asset.allIds.length);
    const creatorsCount = useSelector((state) => state.creator.allIds.length);
    const waitingListCount = useSelector((state) => state.waitingList.allIds.length);

    const cards: HomeCardProps[] = [
        {
            bgcolor: 'primary',
            icon: userMaleIcon,
            title: 'Creators',
            digits: `${creatorsCount}`,
        },
        {
            bgcolor: 'secondary',
            icon: activeAssetsIcon,
            title: 'Active Assets',
            digits: `${activeAssetsCount}`,
        },
        {
            bgcolor: 'info',
            icon: mailBoxIcon,
            title: 'Waiting List',
            digits: `${waitingListCount}`,
        },
    ];

    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
            <Box mt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={12}>
                        <Grid container spacing={3} mt={1}>
                            {cards.map((card, index) => (
                                <HomeCard key={index} {...card} />
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}
