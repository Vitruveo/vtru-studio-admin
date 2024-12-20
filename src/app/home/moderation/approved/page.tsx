'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import RequestConsignDetails from '@/app/home/components/apps/requestConsign/RequestConsignDetails';
import RequestConsignList from '@/app/home/components/apps/requestConsign/RequestConsignList';
import RequestConsignSearch from '@/app/home/components/apps/requestConsign/RequestConsignSearch';
import AppCard from '@/app/home/components/shared/AppCard';
import { Theme, useMediaQuery } from '@mui/material';
import { RequestConsign } from '@/features/requestConsign';
import { BASE_URL_STORE } from '@/constants/api';
import { useDispatch, useSelector } from '@/store/hooks';
import { requestConsignGetThunk } from '@/features/requestConsign/thunks';
import { debounce } from '@mui/material/utils';

const secdrawerWidth = 320;

const ApprovedModerationPage = () => {
    const dispatch = useDispatch();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [search, setSearch] = useState<string | null>(null);
    const [selected, setSelected] = useState<RequestConsign | undefined>(undefined);
    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: RequestConsign[];
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: [],
        total: 0,
        totalPage: 0,
    });
    const status = useSelector((state) => state.requestConsign.status);

    const debouncedSearch = useCallback(
        debounce(async (searchTerm) => {
            const response = await dispatch(
                requestConsignGetThunk({ status: 'approved', search: searchTerm, page: 1 })
            );
            if (response.data) {
                const data = response.data;
                setPaginatedData({
                    data: data.data,
                    currentPage: data.page,
                    total: data.total,
                    totalPage: data.totalPage,
                });
            }
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        handleNextPage();
    }, []);

    useEffect(() => {
        if (search !== null) debouncedSearch(search);
    }, [search, debouncedSearch]);

    const handleSelect = (id: string) => {
        const selectedRequestConsign = paginatedData.data.find((requestConsign) => requestConsign._id === id);

        if (selectedRequestConsign) setSelected(selectedRequestConsign);
    };

    const handleRefresh = async () => {
        setSelected(undefined);

        const response = await dispatch(requestConsignGetThunk({ status: 'approved', page: 1 }));
        if (response.data) {
            const data = response.data;
            setPaginatedData({
                data: data.data,
                currentPage: data.page,
                total: data.total,
                totalPage: data.totalPage,
            });
        }
    };

    const handleNextPage = async () => {
        const response = await dispatch(
            requestConsignGetThunk({ status: 'approved', page: paginatedData.currentPage + 1 })
        );
        if (response.data) {
            const data = response.data;
            setPaginatedData((prev) => ({
                data: [...prev.data, ...data.data],
                currentPage: data.page,
                total: data.total,
                totalPage: data.totalPage,
            }));
        }
    };

    return (
        <PageContainer title="Request Consign" description="this is requests">
            <Breadcrumb title="Request Consign Application" subtitle="List approved requests" />
            <AppCard>
                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}
                >
                    <RequestConsignSearch search={search} setSearch={setSearch} handleRefresh={handleRefresh} />
                    <RequestConsignList
                        requestConsignId={selected ? selected._id : ''}
                        data={paginatedData.data}
                        onClick={({ _id }) => handleSelect(_id)}
                        nextPage={handleNextPage}
                        hasMore={paginatedData.currentPage < paginatedData.totalPage}
                        loading={status === 'loading'}
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
                    {selected ? (
                        <RequestConsignDetails
                            requestId={selected._id}
                            assetId={selected.asset._id}
                            username={selected.creator.username}
                            emails={selected.creator.emails}
                            title={selected.asset.title}
                            status={selected.status}
                            logs={selected?.logs}
                            comments={selected?.comments}
                            approvedBy={selected?.approvedBy}
                            handleApprove={() => {}}
                            handleReject={() => {}}
                            handleCancel={() => {}}
                            handleOpenStore={() =>
                                window.open(`${BASE_URL_STORE}/preview/${selected.asset._id}`, '_blank')
                            }
                        />
                    ) : null}
                </Drawer>
            </AppCard>
        </PageContainer>
    );
};

export default ApprovedModerationPage;
