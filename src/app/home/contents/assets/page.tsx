'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import AssetList from '@/app/home/components/apps/assets/asset-grid/AssetList';
import AssetSidebar from '@/app/home/components/apps/assets/asset-grid/AssetSidebar';
import AppCard from '@/app/home/components/shared/AppCard';
import { Pagination } from '@mui/material';
import { UsePaginationProps } from '@mui/lab';
import { useDispatch, useSelector } from '@/store/hooks';
import { getAssetsThunk } from '@/features/assets/thunks';

const BCrumb = [{ title: 'Home' }, { title: 'Contents' }, { title: 'Assets' }];

const AssetsPage = () => {
    const dispatch = useDispatch();

    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');

    const assets = useSelector((state) => state.asset.allIds.map((id) => state.asset.byId[id]));
    const filter = useSelector((state) => state.asset.filter);

    useEffect(() => {
        dispatch(getAssetsThunk());
    }, []);

    const onPaginationChange: UsePaginationProps['onChange'] = (event, page) => {
        setCurrentPage(page);
    };

    const onFabClick = () => {
        setMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const onSidebarClose = () => {
        setMobileSidebarOpen(false);
    };

    const dataRaw = useMemo(() => {
        return assets.filter((asset) => {
            if (filter === 'blocked') {
                return asset?.consignArtwork?.status === 'blocked';
            }
            if (filter === 'all') {
                return true;
            }
            return asset;
        });
    }, [filter, assets]);

    const dataFiltered = useMemo(() => {
        if (!searchText) return [];
        return dataRaw.filter((asset) => {
            if (searchText) {
                return asset.assetMetadata?.context?.formData?.title?.toLowerCase().includes(searchText.toLowerCase());
            }
            return true;
        });
    }, [dataRaw, searchText]);

    const data = dataFiltered.length > 0 ? dataFiltered : dataRaw;

    const itemsPerPage = 12;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const getAssets = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <PageContainer title="Assets" description="List all assets">
            <Breadcrumb title="Assets" subtitle="List all assets" items={BCrumb} />
            <AppCard>
                <AssetSidebar isMobileSidebarOpen={isMobileSidebarOpen} onSidebarClose={onSidebarClose} />
                <Box p={3} flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <AssetList
                        assets={getAssets}
                        onClick={onFabClick}
                        onChangeSearch={(value) => setSearchText(value)}
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
