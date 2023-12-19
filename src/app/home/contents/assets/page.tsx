'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import ProductList from '@/app/home/components/apps/ecommerce/productGrid/ProductList';
import ProductSidebar from '@/app/home/components/apps/ecommerce/productGrid/ProductSidebar';
import AppCard from '@/app/home/components/shared/AppCard';

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

  return (
    <PageContainer title="Shop" description="this is Shop">
      {/* breadcrumb */}
      <Breadcrumb title="Assets" subtitle="List all assets" />
      <AppCard>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <ProductSidebar isMobileSidebarOpen={isMobileSidebarOpen} onSidebarClose={() => setMobileSidebarOpen(false)} />
        {/* ------------------------------------------- */}
        {/* Right part */}
        {/* ------------------------------------------- */}
        <Box p={3} flexGrow={1}>
          <ProductList onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />
        </Box>
      </AppCard>
    </PageContainer>
  );
};

export default Ecommerce;
