'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import AssetList from '@/app/home/components/apps/ecommerce/asset-grid/AssetList';
import AssetSidebar from '@/app/home/components/apps/ecommerce/asset-grid/AssetSidebar';
import AppCard from '@/app/home/components/shared/AppCard';
import { Pagination } from '@mui/material';
import { UsePaginationProps } from '@mui/lab';
import { list } from '@/services/apiEventSource';
import { AssetType } from '../../types/apps/asset';
import { debounce } from 'lodash';

const BCrumb = [{ title: 'Home' }, { title: 'Contents' }, { title: 'Assets' }];

const AssetsPage = () => {
    const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [assets, setAssets] = useState<AssetType[]>([]);

    const fetchData = async (query?: string) => {
        await list<AssetType>({
            path: 'assets',
            callback: (asset) => setAssets((prevState) => [...prevState, asset]),
            filter: { query },
        });
    };

    useEffect(() => {
        (async () => await fetchData())();
    }, []);

    const debouncedSearch = debounce(async (query: string) => {
        setAssets([]);
        setCurrentPage(1);
        await fetchData(query);
    }, 1000);

    const onPaginationChange: UsePaginationProps['onChange'] = (event, page) => {
        setCurrentPage(page);
    };

    const onFabClick = () => {
        setMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const onSidebarClose = () => {
        setMobileSidebarOpen(false);
    };

    const onSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
    };

    const itemsPerPage = 12;
    const totalPages = Math.ceil(assets.length / itemsPerPage);
    const getAssets = assets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <PageContainer title="Assets" description="List all assets">
            <Breadcrumb title="Assets" subtitle="List all assets" items={BCrumb} />
            <AppCard>
                <AssetSidebar isMobileSidebarOpen={isMobileSidebarOpen} onSidebarClose={onSidebarClose} />

                <Box p={3} flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <AssetList
                        assets={getAssets}
                        onClick={onFabClick}
                        onSearchChange={onSearchChange}
                    />
                    <Box mt={8} mx='auto'>
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
