'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Switch, Button } from '@mui/material';

import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/home/components/container/PageContainer';
import AppCard from '@/app/home/components/shared/AppCard';
import { AssetPreview } from '@/app/home/components/apps/assets/asset-preview/assetPreview';
import { useDispatch, useSelector } from '@/store/hooks';
import { buildAssetSource } from '@/utils/assets';
import { getCreatorNameByAssetIdThunk, updateAssetStatusByIdThunk } from '@/features/assets/thunks';
import { BASE_URL_STORE } from '@/constants/api';
import Modal from '@/app/home/components/modal';
import CreatorDetails from '@/app/home/components/apps/creators/CreatorDetails';

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
    const [open, setOpen] = useState<boolean>(false);
    const asset = useSelector((state) => state.asset.byId[params.id]);
    const creator = useSelector((state) => state.asset.creator);
    const { byId } = useSelector((state) => state.creator);
    const createdBy = byId[asset.framework.createdBy];
    const creatorsFormData = asset?.assetMetadata?.creators?.formData || [];

    const handleChangeAssetBlocked = ({ status }: { status: 'active' | 'blocked' }) => {
        if (!asset) return;

        dispatch(updateAssetStatusByIdThunk({ id: asset._id, status }));
    };

    useEffect(() => {
        dispatch(getCreatorNameByAssetIdThunk({ id: asset._id }));
    }, []);

    const handleClickPreview = () => {
        const isActive = asset?.consignArtwork?.status === 'active';
        const path = isActive ? creator : 'preview';
        const URL = `${BASE_URL_STORE}/${path}/${asset._id}`;
        window.open(URL, '_blank');
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
                            Username
                        </Typography>
                        <Typography
                            variant="body1"
                            onClick={() => setOpen(true)}
                            style={{
                                color: '#763EBD',
                                cursor: 'pointer',
                                display: 'inline-block',
                            }}
                        >
                            {createdBy?.username}
                        </Typography>
                        <Typography variant="h6" mt={2}>
                            Creator name
                        </Typography>
                        {creatorsFormData.map((v) => (
                            <Typography key={v.name} variant="body1">
                                {v.name}{' '}
                            </Typography>
                        ))}

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

                        <Button disabled={!asset || !createdBy} onClick={handleClickPreview}>
                            <Typography>Preview</Typography>
                        </Button>
                    </Box>
                </Box>
            </AppCard>
            <Modal open={open} handleClose={() => setOpen(false)} title="">
                {createdBy?._id && <CreatorDetails creatorId={createdBy._id} hiddenPreview />}
            </Modal>
        </PageContainer>
    );
};

export default AssetsOnePage;
