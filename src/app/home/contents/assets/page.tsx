'use client';

import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import AssetList from '@/app/home/components/apps/assets/asset-grid/AssetList';
import AssetSidebar from '@/app/home/components/apps/assets/asset-grid/AssetSidebar';
import AppCard from '@/app/home/components/shared/AppCard';
import { Pagination } from '@mui/material';
import { UsePaginationProps } from '@mui/lab';
import { useDispatch, useSelector } from '@/store/hooks';
import { setCurrentPageThunk } from '@/features/assets/thunks';
import { useLiveStream } from '../../components/liveStream';
import {
    CREATED_ASSET,
    CREATED_CREATOR,
    DELETED_ASSET,
    DELETED_CREATOR,
    EVENTS_ASSETS,
    EVENTS_CREATORS,
    LIST_ASSETS,
    LIST_CREATORS,
    UPDATED_ASSET,
    UPDATED_CREATOR,
} from '../../components/liveStream/events';
import { AssetType } from '../../types/apps/asset';
import { CreatorType } from '@/features/creator';

const AssetsPage = () => {
    const dispatch = useDispatch();
    const cachePage = useSelector((state) => state.asset.currentPage);

    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(cachePage || 1);
    const [searchText, setSearchText] = useState('');

    const { chunk: assets, loading: loadingAssets } = useLiveStream<AssetType>({
        event: {
            list: LIST_ASSETS,
            update: UPDATED_ASSET,
            delete: DELETED_ASSET,
            create: CREATED_ASSET,
        },
        listemEvents: EVENTS_ASSETS,
    });

    const { chunk: creators, loading: loadingCreators } = useLiveStream<CreatorType>({
        event: {
            list: LIST_CREATORS,
            update: UPDATED_CREATOR,
            delete: DELETED_CREATOR,
            create: CREATED_CREATOR,
        },
        listemEvents: EVENTS_CREATORS,
    });

    // const assets = useSelector((state) => state.asset.allIds.map((id) => state.asset.byId[id]));
    // const creators = useSelector((state) => state.creator.allIds.map((id) => state.creator.byId[id]));
    const filter = useSelector((state) => state.asset.filter);

    const assetsWithCreators = useMemo(() => {
        return assets.map((asset) => {
            const creator = creators.find((item) => item._id === asset.framework.createdBy);
            return { ...asset, creator };
        });
    }, [assets, creators]);

    const onPaginationChange: UsePaginationProps['onChange'] = (_event, page) => {
        setCurrentPage(page);
        dispatch(setCurrentPageThunk(page));
    };

    const onFabClick = () => {
        setMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const onSidebarClose = () => {
        setMobileSidebarOpen(false);
    };

    const dataRaw = useMemo(() => {
        return assetsWithCreators.filter((asset) => {
            if (filter === 'blocked') {
                return asset?.consignArtwork?.status === 'blocked';
            }

            if (filter == 'active') {
                return asset?.consignArtwork?.status === 'active';
            }

            if (filter === 'consigned') {
                return asset?.contractExplorer?.explorer;
            }

            if (filter === 'all') {
                return true;
            }
            return asset;
        });
    }, [assetsWithCreators, filter]);

    const dataFiltered = useMemo(() => {
        if (!searchText) return [];
        return dataRaw.filter((item) => {
            if (searchText) {
                return (
                    item.assetMetadata?.context?.formData?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.creator?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.creator?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.creator?.emails?.some((emails) =>
                        emails.email.toLowerCase().includes(searchText.toLowerCase())
                    )
                );
            }
            return true;
        });
    }, [dataRaw, searchText]);

    const selectData = () => {
        if (dataFiltered.length > 0) {
            return dataFiltered;
        }
        if (searchText) {
            return [];
        }
        return dataRaw;
    };

    const data = selectData();

    const itemsPerPage = 12;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const getAssets = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <PageContainer title="Assets" description="List all assets">
            <Breadcrumb title="Assets" subtitle="List all assets" />
            <AppCard>
                <AssetSidebar isMobileSidebarOpen={isMobileSidebarOpen} onSidebarClose={onSidebarClose} />
                <Box p={3} flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <AssetList
                        assets={getAssets}
                        onClick={onFabClick}
                        onChangeSearch={(value) => setSearchText(value)}
                        loading={loadingAssets || loadingCreators}
                    />

                    <Box mt={8} mx="auto">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={onPaginationChange}
                            color="primary"
                        />
                    </Box>
                </Box>
            </AppCard>
        </PageContainer>
    );
};

export default AssetsPage;
