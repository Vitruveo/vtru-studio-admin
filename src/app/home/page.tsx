'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/home/components/container/PageContainer';
import activeAssetsIcon from '../../../public/images/svgs/icon-dd-application.svg';
import userMaleIcon from '../../../public/images/svgs/icon-user-male.svg';
import mailBoxIcon from '../../../public/images/svgs/icon-mailbox.svg';
import { HomeCard, HomeCardProps } from './components/widgets/cards/home-card';
import { useDispatch, useSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { getCreatorsThunk } from '@/features/creator';
import { getAssetsThunk } from '@/features/assets/thunks';
import { getWaitingListThunk } from '@/features/waitingList/thunks';

export default function Dashboard() {
    const dispatch = useDispatch();
    const activeAssetsCount = useSelector((state) => state.asset.allIds.length);
    const creatorsCount = useSelector((state) => state.creator.all.length);
    const waitingListCount = useSelector(state => state.waitingList.all.length);

    useEffect(() => {
        dispatch(getCreatorsThunk());
        dispatch(getAssetsThunk())
        dispatch(getWaitingListThunk())
    }, [dispatch]);

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
