'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import AssetList from '@/app/home/components/apps/assets/asset-grid/AssetList';
import AssetSidebar from '@/app/home/components/apps/assets/asset-grid/AssetSidebar';
import AppCard from '@/app/home/components/shared/AppCard';
import { Pagination } from '@mui/material';
import { debounce } from 'lodash';
import { UsePaginationProps } from '@mui/lab';
import { useDispatch, useSelector } from '@/store/hooks';
import { getAssetsPaginatedThunk, setCurrentPageThunk } from '@/features/assets/thunks';
import { AssetType } from '../../types/apps/asset';

const AssetsPage = () => {
    const dispatch = useDispatch();
    const cachePage = useSelector((state) => state.asset.currentPage);

    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [currentPage, setCurrentPage] = useState(cachePage || 1);
    const [searchText, setSearchText] = useState('');
    const [query, setQuery] = useState<Record<string, any>>({});

    const [assets, setAssets] = useState<{
        data: AssetType[];
        page: number;
        total: number;
        totalPage: number;
        limit: number;
    }>({
        data: [],
        page: 1,
        total: 0,
        totalPage: 0,
        limit: 0,
    });

    const searchAssets = debounce((value: string) => {
        setCurrentPage(1);
        setSearchText(value);
    }, 500);

    useEffect(() => {
        const fetchAssets = async () => {
            setLoadingAssets(true);
            const response = await dispatch(
                getAssetsPaginatedThunk({
                    page: currentPage,
                    name: searchText,
                    query,
                })
            );
            if (response) setAssets(response);
            setLoadingAssets(false);
        };

        fetchAssets();
    }, [currentPage, searchText, query]);

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

    const handleChangeFilter = (name: 'all' | 'active' | 'blocked' | 'consigned') => {
        setCurrentPage(1);
        switch (name) {
            case 'all':
                setQuery({});
                break;
            case 'active':
                setQuery({ 'consignArtwork.status': 'active' });
                break;
            case 'blocked':
                setQuery({ 'consignArtwork.status': 'blocked' });
                break;
            case 'consigned':
                setQuery({ 'contractExplorer.explorer': { $exists: true } });
                break;
            default:
                break;
        }
    };

    return (
        <PageContainer title="Assets" description="List all assets">
            <Breadcrumb title="Assets" subtitle="List all assets" />
            <AppCard>
                <AssetSidebar
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    onSidebarClose={onSidebarClose}
                    handleChangeFilter={handleChangeFilter}
                />
                <Box p={3} flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <AssetList
                        assets={assets.data}
                        onClick={onFabClick}
                        onChangeSearch={(value) => searchAssets(value)}
                        loading={loadingAssets}
                    />

                    <Box mt={8} mx="auto">
                        <Pagination
                            count={assets.totalPage}
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
