'use client';

import React from 'react';
import { Typography, Box, Grid, Switch } from '@mui/material';

import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import AppCard from '@/app/home/components/shared/AppCard';
import { AssetPreview } from '@/app/home/components/apps/assets/asset-preview/assetPreview';
import { useDispatch, useSelector } from '@/store/hooks';
import { buildAssetSource } from '@/utils/assets';
import { updateAssetStatusByIdThunk } from '@/features/assets/thunks';

const BCrumb = [
    { title: 'Home' },
    { title: 'Contents' },
    { title: 'Assets', to: '/home/contents/assets' },
    { title: 'Asset' },
];

interface Props {
    params: { id: string };
}

const AssetsOnePage = ({ params }: Props) => {
    const dispatch = useDispatch();
    const asset = useSelector((state) => state.asset.byId[params.id]);

    const handleChangeAssetBlocked = ({ status }: { status: 'active' | 'blocked' }) => {
        if (!asset) return;

        dispatch(updateAssetStatusByIdThunk({ id: asset._id, status }));
    };

    if (!asset) {
        return (
            <PageContainer title="Asset" description="List one asset">
                <Breadcrumb title="Asset" subtitle="List one asset" items={BCrumb} />

                <AppCard>
                    <Typography variant="h2">Asset not found</Typography>
                </AppCard>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Asset" description="List one asset">
            <Breadcrumb title="Asset" subtitle="List one asset" items={BCrumb} />

            <AppCard>
                <Box display="flex" gap={2}>
                    <Box>
                        <Box width={250}>
                            <AssetPreview media={buildAssetSource(asset?.formats?.preview?.path)} />
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="h2">{asset.assetMetadata?.context?.formData.title}</Typography>
                        <Typography variant="h6" mt={2}>
                            Description
                        </Typography>
                        <Typography variant="body1">{asset.assetMetadata?.context?.formData.description}</Typography>

                        <Grid container>
                            <Grid item lg={12} xs={12} mt={2}>
                                <Typography variant="h6" color="text.secondary">
                                    Status Consign Artwork
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Switch
                                        checked={asset?.consignArtwork?.status === 'blocked'}
                                        onChange={(event) => {
                                            const status = event.target.checked ? 'blocked' : 'active';
                                            handleChangeAssetBlocked({ status });
                                        }}
                                    />
                                    <Typography variant="body1" color="text.secondary">
                                        {asset?.consignArtwork?.status}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </AppCard>
        </PageContainer>
    );
};

export default AssetsOnePage;
