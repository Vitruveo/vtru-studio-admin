'use client';

import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import RequestConsignDetails from '@/app/home/components/apps/requestConsign/RequestConsignDetails';
import RequestConsignList from '@/app/home/components/apps/requestConsign/RequestConsignList';
import RequestConsignSearch from '@/app/home/components/apps/requestConsign/RequestConsignSearch';
import AppCard from '@/app/home/components/shared/AppCard';
import { Theme, useMediaQuery } from '@mui/material';
import { useDispatch } from '@/store/hooks';
import { consignThunk } from '@/features/requestConsign/thunks';
import { RequestConsign, requestConsignActionsCreators } from '@/features/requestConsign';
import { BASE_URL_STORE } from '@/constants/api';
import { toastrActionsCreators } from '@/features/toastr/slice';
import { useLiveStream } from '../../components/liveStream';
import {
    CREATED_REQUEST_CONSIGN,
    DELETED_REQUEST_CONSIGN,
    EVENTS_REQUEST_CONSIGNS,
    LIST_REQUEST_CONSIGNS,
    UPDATED_REQUEST_CONSIGN,
} from '../../components/liveStream/events';

const secdrawerWidth = 320;

const RejectedModerationPage = () => {
    const dispatch = useDispatch();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<RequestConsign | undefined>(undefined);

    const { chunk: rawRequestConsings, loading } = useLiveStream<RequestConsign>({
        event: {
            list: LIST_REQUEST_CONSIGNS,
            update: UPDATED_REQUEST_CONSIGN,
            delete: DELETED_REQUEST_CONSIGN,
            create: CREATED_REQUEST_CONSIGN,
        },
        listemEvents: EVENTS_REQUEST_CONSIGNS,
    });

    const requestConsigns = useMemo(
        () => rawRequestConsings.filter((item) => item.status === 'rejected'),
        [rawRequestConsings]
    );

    const handleSelect = (id: string) => {
        const selectedRequestConsign = requestConsigns.find((item) => item._id === id);

        if (selectedRequestConsign) setSelected(selectedRequestConsign);
    };

    const handleApprove = () => {
        if (selected) {
            dispatch(requestConsignActionsCreators.setRequestConsign(selected));
            dispatch(consignThunk({ requestId: selected._id }));
        } else {
            dispatch(toastrActionsCreators.displayToastr({ message: 'No Asset selected', type: 'error' }));
        }
    };

    const filteredAndSearchedConsigns = useMemo(() => {
        return requestConsigns.filter((item) => {
            const matchesSearch = search
                ? [item.creator.username, item.asset.title, ...item.creator.emails.map((email) => email.email)]
                      .filter(Boolean)
                      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
                : true;
            return matchesSearch;
        });
    }, [requestConsigns, search]);

    return (
        <PageContainer title="Request Consign" description="this is requests">
            <Breadcrumb title="Request Consign Application" subtitle="List rejected requests" />
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
                        data={filteredAndSearchedConsigns}
                        onClick={({ _id }) => handleSelect(_id)}
                        loading={loading}
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
                            handleReject={() => {}}
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

export default RejectedModerationPage;
