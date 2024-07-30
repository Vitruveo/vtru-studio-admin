'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from '@/store/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import CreatorDetails from '@/app/home/components/apps/creators/CreatorDetails';
import CreatorList from '@/app/home/components/apps/creators/CreatorList';
import CreatorSearch from '@/app/home/components/apps/creators/CreatorSearch';
import CreatorFilter from '@/app/home/components/apps/creators/CreatorFilter';
import AppCard from '@/app/home/components/shared/AppCard';
import { CreatorDialogDelete } from '../../components/apps/creators/CreatorDialogDelete';

import { subscribeWebSocketThunk, unsubscribeWebSocketThunk, websocketSelector } from '@/features/ws';
import { CreatorType, creatorActionsCreators, deleteCreatorThunk } from '@/features/creator';
import { useLiveStream } from '../../components/liveStream';
import {
    CREATED_CREATOR,
    DELETED_CREATOR,
    EVENTS_CREATORS,
    LIST_CREATORS,
    UPDATED_CREATOR,
} from '../../components/liveStream/events';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Creators() {
    const dispatch = useDispatch();
    // const creators = useSelector((state) => state.creator.allIds.map((id) => state.creator.byId[id]));
    const { creatorsOnline } = useSelector(websocketSelector(['creatorsOnline']));
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [search, setSearch] = useState('');
    const [creatorId, setCreatorId] = useState('');
    const [isCreatorsOnline, setIsCreatorsOnline] = useState(false);
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [creatorDelete, setCreatorDelete] = useState({ email: '', id: '' });

    const { chunk: creators, loading: loadingCreators } = useLiveStream<CreatorType>({
        event: {
            list: LIST_CREATORS,
            update: UPDATED_CREATOR,
            delete: DELETED_CREATOR,
            create: CREATED_CREATOR,
        },
        listemEvents: EVENTS_CREATORS,
    });

    useEffect(() => {
        dispatch(subscribeWebSocketThunk());
        return () => {
            dispatch(unsubscribeWebSocketThunk());
        };
    }, []);

    const creatorsFiltered = useMemo(() => {
        return search.length > 0
            ? creators.filter(
                  (creator) =>
                      creator?.username?.toLowerCase().includes(search.toLowerCase()) ||
                      creator.emails.some((item) => item.email.toLowerCase().includes(search.toLowerCase()))
              )
            : [];
    }, [search, creators]);

    const creatorsOnlineFiltered = useMemo(() => {
        return creators.filter((creator) => creatorsOnline.some((item) => creator._id === item._id));
    }, [creators, creatorsOnline]);

    const creatorsBlockedFiltered = useMemo(() => {
        return creators.filter((creator) => creator?.vault?.isBlocked);
    }, [creators]);

    const onDeleteClick = ({ id, email }: { id: string; email: string }) => {
        setIsOpenDialogDelete(true);
        setCreatorDelete({ id, email });
    };

    const onDeleteConfirm = () => {
        dispatch(deleteCreatorThunk(creatorDelete.id));
        if (creatorDelete.id === creatorId) setCreatorId('');
        setIsOpenDialogDelete(false);
    };

    return (
        <PageContainer title="Creator" description="this is Creators">
            <Breadcrumb title="Creators Application" subtitle="List Your Creators" />
            <AppCard>
                <Drawer
                    open={isLeftSidebarOpen}
                    onClose={() => setLeftSidebarOpen(false)}
                    sx={{
                        width: drawerWidth,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            position: 'relative',
                            zIndex: 2,
                        },
                        flexShrink: 0,
                    }}
                    variant={lgUp ? 'permanent' : 'temporary'}
                >
                    <CreatorFilter
                        handleToggleOnline={() => setIsCreatorsOnline(!isCreatorsOnline)}
                        handleToggleBlocked={() => setIsBlocked(!isBlocked)}
                    />
                </Drawer>

                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}
                >
                    <CreatorSearch onClick={() => setLeftSidebarOpen(true)} search={search} setSearch={setSearch} />
                    <CreatorList
                        creatorId={creatorId}
                        data={
                            (search.length > 0 && creatorsFiltered) ||
                            (isBlocked && creatorsBlockedFiltered) ||
                            (isCreatorsOnline && creatorsOnlineFiltered) ||
                            creators
                        }
                        onDeleteClick={onDeleteClick}
                        onCreatorClick={(creator) => {
                            dispatch(creatorActionsCreators.setCreator(creator));
                            setCreatorId(creator._id);
                        }}
                        loading={loadingCreators}
                    />
                </Box>

                <Drawer
                    anchor="right"
                    open={isRightSidebarOpen}
                    onClose={() => setRightSidebarOpen(false)}
                    variant={mdUp ? 'permanent' : 'temporary'}
                    sx={{
                        width: mdUp ? secdrawerWidth : '100%',
                        zIndex: lgUp ? 0 : 1,
                        flex: mdUp ? 'auto' : '',
                        [`& .MuiDrawer-paper`]: { width: '100%', position: 'relative' },
                    }}
                >
                    {mdUp ? (
                        ''
                    ) : (
                        <Box sx={{ p: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => setRightSidebarOpen(false)}
                                sx={{ mb: 3, display: { xs: 'block', md: 'none', lg: 'none' } }}
                            >
                                Back{' '}
                            </Button>
                        </Box>
                    )}
                    <CreatorDetails creatorId={creatorId} onDeleteClick={onDeleteClick} />
                </Drawer>
            </AppCard>

            <CreatorDialogDelete
                creatorName={creatorDelete.email}
                isOpen={isOpenDialogDelete}
                handleCancel={() => setIsOpenDialogDelete(!isOpenDialogDelete)}
                handleConfirm={onDeleteConfirm}
            />
        </PageContainer>
    );
}
