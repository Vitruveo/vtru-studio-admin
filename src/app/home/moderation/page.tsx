'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import RequestConsignDetails from '@/app/home/components/apps/requestConsign/RequestConsignDetails';
import RequestConsignList from '@/app/home/components/apps/requestConsign/RequestConsignList';
import RequestConsignSearch from '@/app/home/components/apps/requestConsign/RequestConsignSearch';
import AppCard from '@/app/home/components/shared/AppCard';
import { Button, Modal, Theme, Typography, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from '@/store/hooks';
import {
    consignThunk,
    requestConsignGetThunk,
    requestConsignUpdateStatusThunk,
} from '@/features/requestConsign/thunks';
import { RequestConsign } from '@/features/requestConsign';
import { BASE_URL_STORE } from '@/constants/api';
import { toastrActionsCreators } from '@/features/toastr/slice';

const drawerWidth = 240;
const secdrawerWidth = 320;

const ModerationPage = () => {
    const dispatch = useDispatch();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<RequestConsign | undefined>(undefined);
    const [filtered, setFiltered] = useState('');
    const [confirmRejectModal, setConfirmRejectModal] = useState(false);

    const requestConsigns = useSelector((state) =>
        state.requestConsign.allIds.map((id) => state.requestConsign.byId[id])
    );
    const requestConsignById = useSelector((state) => state.requestConsign.byId);

    useEffect(() => {
        dispatch(requestConsignGetThunk());
    }, []);

    const handleSelect = (id: string) => {
        setSelected(requestConsignById[id]);
    };

    const handleFilter = (status: string) => {
        if (status === filtered) {
            setFiltered('');
            return;
        }

        setFiltered(status);
    };

    const handleApprove = () => {
        if (selected) {
            dispatch(requestConsignUpdateStatusThunk(selected._id, 'running'));
            dispatch(consignThunk({ requestId: selected._id }));
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }
    };
    const handleReject = () => {
        if (selected) {
            dispatch(requestConsignUpdateStatusThunk(selected._id, 'rejected'));
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }

        setConfirmRejectModal(false);
    };

    return (
        <PageContainer title="Request Consign" description="this is requests">
            <Breadcrumb title="Request Consign Application" subtitle="List creators requests" />
            <AppCard>
                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}
                >
                    <RequestConsignSearch search={search} setSearch={setSearch} />
                    <RequestConsignList
                        requestConsignId={selected ? selected._id : ''}
                        data={
                            filtered
                                ? requestConsigns.filter((item) => item.status === filtered)
                                : search
                                  ? requestConsigns.filter(
                                        (item) =>
                                            item.creator.username.includes(search) || item.asset.title.includes(search)
                                    )
                                  : requestConsigns
                        }
                        onClick={({ _id }) => handleSelect(_id)}
                        handleFilter={handleFilter}
                        activeFilter={filtered}
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
                            handleApprove={handleApprove}
                            handleReject={() => setConfirmRejectModal(true)}
                            handleOpenStore={() =>
                                window.open(`${BASE_URL_STORE}/preview/${selected.asset._id}/${Date.now()}`, '_blank')
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
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setConfirmRejectModal(false)}>Cancel</Button>
                        <Button onClick={handleReject} variant="contained" color="error">
                            Reject
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </PageContainer>
    );
};

export default ModerationPage;

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