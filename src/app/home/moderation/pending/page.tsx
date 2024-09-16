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
import { Button, Modal, Theme, Typography, useMediaQuery } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useDispatch, useSelector } from '@/store/hooks';
import {
    consignThunk,
    requestConsignGetThunk,
    requestConsignUpdateStatusThunk,
} from '@/features/requestConsign/thunks';
import { RequestConsign, requestConsignActionsCreators } from '@/features/requestConsign';
import { BASE_URL_STORE } from '@/constants/api';
import { toastrActionsCreators } from '@/features/toastr/slice';

const secdrawerWidth = 320;

const PendingModerationPage = () => {
    const dispatch = useDispatch();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [search, setSearch] = useState<string | null>(null);
    const [selected, setSelected] = useState<RequestConsign | undefined>(undefined);
    const [confirmRejectModal, setConfirmRejectModal] = useState(false);
    const [confirmCancelModal, setConfirmCancelModal] = useState(false);
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
            const response = await dispatch(requestConsignGetThunk({ status: 'pending', search: searchTerm, page: 1 }));
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
        const selectedRequestConsigns = paginatedData.data.find((requestConsign) => requestConsign._id === id);

        if (selectedRequestConsigns) {
            setSelected(selectedRequestConsigns);
            dispatch(requestConsignActionsCreators.setRequestConsign(selectedRequestConsigns));
        }
    };

    const handleApprove = () => {
        if (selected) {
            dispatch(requestConsignActionsCreators.setRequestConsign(selected));
            dispatch(consignThunk({ requestId: selected._id }));
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }
    };

    const handleReject = () => {
        if (selected) {
            dispatch(requestConsignActionsCreators.setRequestConsign(selected));
            dispatch(requestConsignUpdateStatusThunk(selected._id, 'rejected'));
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }

        setConfirmRejectModal(false);
    };

    const handleCancel = () => {
        if (selected) {
            dispatch(requestConsignActionsCreators.setRequestConsign(selected));
            dispatch(requestConsignUpdateStatusThunk(selected._id, 'canceled'));
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }

        setConfirmCancelModal(false);
    };

    const handleRefresh = async () => {
        const response = await dispatch(requestConsignGetThunk({ status: 'pending', page: 1 }));
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
            requestConsignGetThunk({ status: 'pending', page: paginatedData.currentPage + 1 })
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
            <Breadcrumb title="Request Consign Application" subtitle="List pending requests" />
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
                            handleApprove={handleApprove}
                            handleReject={() => setConfirmRejectModal(true)}
                            handleCancel={() => setConfirmCancelModal(true)}
                            handleOpenStore={() =>
                                window.open(`${BASE_URL_STORE}/preview/${selected.asset._id}`, '_blank')
                            }
                        />
                    ) : null}
                </Drawer>
            </AppCard>

            <Modal
                open={confirmRejectModal}
                onClose={() => setConfirmRejectModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirm Reject
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to reject this request?
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={() => setConfirmRejectModal(false)}>Cancel</Button>
                        <Button onClick={handleReject} variant="contained" color="error">
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={confirmCancelModal}
                onClose={() => setConfirmCancelModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirm Cancel Consign
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to cancel consign this request?
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={() => setConfirmCancelModal(false)}>Cancel</Button>
                        <Button onClick={handleCancel} variant="contained" color="error">
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </PageContainer>
    );
};

export default PendingModerationPage;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
