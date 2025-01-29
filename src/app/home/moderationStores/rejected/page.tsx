'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Button, Modal, Theme, Typography, useMediaQuery } from '@mui/material';
import { debounce } from '@mui/material/utils';

// components
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import ArtCardsDetails from '@/app/home/components/apps/artCards/ArtCardsDetails';
import ArtCardsList from '@/app/home/components/apps/artCards/ArtCardsList';
import ArtCardsSearch from '@/app/home/components/apps/artCards/ArtCardsSearch';
import AppCard from '@/app/home/components/shared/AppCard';
// features
import { getAssetArtCardsThunk, updateAssetArtCardsThunk } from '@/features/assets/thunks';
import { toastrActionsCreators } from '@/features/toastr/slice';
import { AssetType } from '../../types/apps/asset';
// hooks
import { useDispatch, useSelector } from '@/store/hooks';

const secdrawerWidth = 320;

const RejectedModerationPage = () => {
    const dispatch = useDispatch();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [search, setSearch] = useState<string | null>(null);
    const [selected, setSelected] = useState<AssetType | undefined>(undefined);
    const [confirmRejectModal, setConfirmRejectModal] = useState(false);
    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: AssetType[];
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
                getAssetArtCardsThunk({ status: 'rejected', search: searchTerm, page: 1, limit: 10 })
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
        const selectedRequestConsigns = paginatedData.data.find((requestConsign) => requestConsign._id === id);

        if (selectedRequestConsigns) {
            setSelected(selectedRequestConsigns);
        }
    };

    const handleApprove = () => {
        if (selected) {
            dispatch(updateAssetArtCardsThunk({ id: selected._id, status: 'approved' }));
            handleRefresh();
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }
    };

    const handleReject = () => {
        if (selected) {
            dispatch(updateAssetArtCardsThunk({ id: selected._id, status: 'rejected' }));

            handleRefresh();
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }

        setConfirmRejectModal(false);
    };

    const handleRefresh = async () => {
        setSelected(undefined);

        const response = await dispatch(getAssetArtCardsThunk({ status: 'rejected', page: 1, limit: 10 }));
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
            getAssetArtCardsThunk({ status: 'rejected', page: paginatedData.currentPage + 1, limit: 10 })
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
        <PageContainer title="Art Cards" description="this is requests">
            <Breadcrumb title="Art Cards Application" subtitle="List rejected requests" />
            <AppCard>
                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}
                >
                    <ArtCardsSearch search={search} setSearch={setSearch} handleRefresh={handleRefresh} />

                    <ArtCardsList
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
                        <ArtCardsDetails
                            username={selected.creator?.username ?? ''}
                            emails={[]}
                            title={selected.assetMetadata.context?.formData.title ?? ''}
                            status={selected.licenses.artCards.status}
                            preview={selected.formats?.preview.path ?? ''}
                            handleApprove={handleApprove}
                            handleReject={() => setConfirmRejectModal(true)}
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

export default RejectedModerationPage;

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
