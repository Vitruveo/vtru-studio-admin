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
import { getCreatorsPaginatedThunk } from '@/features/creator/thunks';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Creators() {
    const dispatch = useDispatch();

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
    const [loadingCreators, setLoadingCreators] = useState(false);
    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: CreatorType[];
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: [],
        total: 0,
        totalPage: 0,
    });

    useEffect(() => {
        dispatch(subscribeWebSocketThunk());
        return () => {
            dispatch(unsubscribeWebSocketThunk());
        };
    }, []);

    useEffect(() => {
        handleNextPage();
    }, []);

    const creatorsFiltered = useMemo(() => {
        return search.length > 0
            ? paginatedData.data.filter(
                (creator) =>
                    creator?.username?.toLowerCase().includes(search.toLowerCase()) ||
                    creator.emails.some((item) => item.email.toLowerCase().includes(search.toLowerCase()))
            )
            : [];
    }, [search, paginatedData.data]);

    const creatorsOnlineFiltered = useMemo(() => {
        return paginatedData.data.filter((creator) => creatorsOnline.some((item) => creator._id === item._id));
    }, [paginatedData.data, creatorsOnline]);

    const creatorsBlockedFiltered = useMemo(() => {
        return paginatedData.data.filter((creator) => creator?.vault?.isBlocked);
    }, [paginatedData.data]);

    const onDeleteClick = ({ id, email }: { id: string; email: string }) => {
        setIsOpenDialogDelete(true);
        setCreatorDelete({ id, email });
    };

    const onDeleteConfirm = () => {
        dispatch(deleteCreatorThunk(creatorDelete.id));
        if (creatorDelete.id === creatorId) setCreatorId('');
        setIsOpenDialogDelete(false);
    };

    const handleNextPage = async () => {
        setLoadingCreators(true);
        const response = await dispatch(getCreatorsPaginatedThunk({ page: paginatedData.currentPage + 1, limit: 10 }));
        if (response.data.length) {
            setPaginatedData((prev) => ({
                data: [...prev.data, ...response.data],
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            }));
        }
        setLoadingCreators(false);
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
                            paginatedData.data
                        }
                        onDeleteClick={onDeleteClick}
                        onCreatorClick={(creator) => {
                            dispatch(creatorActionsCreators.setCreator(creator));
                            setCreatorId(creator._id);
                        }}
                        loading={loadingCreators}
                        nextPage={handleNextPage}
                        hasMore={paginatedData.currentPage < paginatedData.totalPage}
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
