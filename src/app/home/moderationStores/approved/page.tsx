'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Button, Modal, Theme, Typography, debounce, useMediaQuery } from '@mui/material';

// components
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import AppCard from '@/app/home/components/shared/AppCard';
// features
import { toastrActionsCreators } from '@/features/toastr/slice';
// hooks
import { useDispatch } from '@/store/hooks';
import { getStoresPaginatedThunk, updateStoreStatusThunk, updateStoresSpotlightThunk } from '@/features/stores/thunks';
import { Stores } from '@/features/stores/types';
import StoresList from '../../components/apps/stores/StoresList';
import StoresDetails from '../../components/apps/stores/StoresDetails';
import StoresSearch from '../../components/apps/stores/StoresSearch';

const secdrawerWidth = 320;

const ApprovedModerationPage = () => {
    const dispatch = useDispatch();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [search, setSearch] = useState<string | null>(null);
    const [selected, setSelected] = useState<Stores | undefined>(undefined);
    const [confirmRejectModal, setConfirmRejectModal] = useState(false);
    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: Stores[];
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: [],
        total: 0,
        totalPage: 0,
    });

    const debouncedSearch = useCallback(
        debounce(async (searchTerm) => {
            const response = await dispatch(
                getStoresPaginatedThunk({ status: 'active', search: searchTerm, page: 1, limit: 25 })
            );
            if (response.data) {
                setPaginatedData({
                    data: response.data,
                    currentPage: response.page,
                    total: response.total,
                    totalPage: response.totalPage,
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
        const selectedStores = paginatedData.data.find((stores) => stores._id === id);

        if (selectedStores) {
            setSelected(selectedStores);
        }
    };

    const handleApprove = () => {
        if (selected) {
            dispatch(updateStoreStatusThunk({ id: selected._id, status: 'active' }));
            handleRefresh();
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Store selected', type: 'error' }));
        }
    };

    const handleReject = () => {
        if (selected) {
            dispatch(updateStoreStatusThunk({ id: selected._id, status: 'inactive' }));
            handleRefresh();
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Store selected', type: 'error' }));
        }

        setConfirmRejectModal(false);
    };

    const handleChangeSpotlight = (displaySpotlight: boolean) => {
        if (selected) {
            setSelected({ ...selected, actions: { ...selected.actions, spotlight: displaySpotlight } });
            setPaginatedData((prev) => ({
                ...prev,
                data: prev.data.map((stores) =>
                    stores._id === selected._id
                        ? { ...stores, actions: { ...stores.actions, spotlight: displaySpotlight } }
                        : stores
                ),
            }));
            dispatch(updateStoresSpotlightThunk({ id: selected._id, spotlight: displaySpotlight }));
        }
    };

    const handleRefresh = async () => {
        setSelected(undefined);

        const response = await dispatch(getStoresPaginatedThunk({ status: 'active', page: 1, limit: 25 }));
        if (response.data) {
            setPaginatedData({
                data: response.data,
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            });
        }
    };

    const handleNextPage = async () => {
        const response = await dispatch(
            getStoresPaginatedThunk({ status: 'active', page: paginatedData.currentPage + 1, limit: 25 })
        );
        if (response.data.length) {
            setPaginatedData((prev) => ({
                data: [...prev.data, ...response.data],
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            }));
        }
    };

    return (
        <PageContainer title="Stores" description="this is requests">
            <Breadcrumb title="Stores Application" subtitle="List approved requests" />
            <AppCard>
                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}
                >
                    <StoresSearch search={search} setSearch={setSearch} handleRefresh={handleRefresh} />

                    <StoresList
                        storesId={selected ? selected._id : ''}
                        data={paginatedData.data}
                        hasMore={paginatedData.currentPage < paginatedData.totalPage}
                        onClick={({ _id }) => handleSelect(_id)}
                        nextPage={handleNextPage}
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
                        <StoresDetails
                            store={selected}
                            handleApprove={handleApprove}
                            handleReject={() => setConfirmRejectModal(true)}
                            handleChangeSpotlight={handleChangeSpotlight}
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
        </PageContainer>
    );
};

export default ApprovedModerationPage;

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
