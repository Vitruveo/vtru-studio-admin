'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import ProductList from '@/app/home/components/apps/ecommerce/asset-grid/AssetList';
import ProductSidebar from '@/app/home/components/apps/ecommerce/asset-grid/AssetSidebar';
import AppCard from '@/app/home/components/shared/AppCard';
import { Pagination } from '@mui/material';
import { UsePaginationProps } from '@mui/lab';
import { productsData } from '@/mock/assets';
import { list } from '@/services/apiEventSource';
import { AssetType } from '../../types/apps/asset';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Assets',
    },
];

const Ecommerce = () => {
    const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [assets, setAssets] = useState<AssetType[]>([]);

    useEffect(() => {
      const fetchData = async () => {
          await list<AssetType>({
              path: 'assets',
              callback: (asset) => setAssets((prevState) => [...prevState, asset]),
          });
      };
      fetchData();
  }, []);

    const onPaginationChange: UsePaginationProps['onChange'] = (event, page) => {
        setCurrentPage(page);
    };

    const itemsPerPage = 10;
    const totalPages = Math.ceil(assets.length / itemsPerPage);
    const getAssets = assets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <PageContainer title="Shop" description="this is Shop">
            {/* breadcrumb */}
            <Breadcrumb title="Assets" subtitle="List all assets" />
            <AppCard>
                {/* ------------------------------------------- */}
                {/* Left part */}
                {/* ------------------------------------------- */}
                <ProductSidebar
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    onSidebarClose={() => setMobileSidebarOpen(false)}
                />
                {/* ------------------------------------------- */}
                {/* Right part */}
                {/* ------------------------------------------- */}
                <Box p={3} flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <ProductList assets={getAssets} onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />
                    <Box mt={8}>
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

export default Ecommerce;
