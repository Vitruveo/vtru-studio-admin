import React from 'react';
import { Typography, CardContent, Skeleton } from '@mui/material';
import BlankCard from '../../../shared/BlankCard';
import { AssetPreview } from '../asset-preview/assetPreview';

interface AssetCardProps {
    media?: string;
    title: string;
    isLoading?: boolean;
}

const AssetSkeleton = () => (
    <Skeleton
        variant="rectangular"
        width={270}
        height={300}
        sx={{
            borderRadius: (theme) => theme.shape.borderRadius / 5,
        }}
    ></Skeleton>
);

export const AssetCard = ({ media, title, isLoading }: AssetCardProps) => {
    if (isLoading) return <AssetSkeleton />;

    return (
        <BlankCard className="hoverCard">
            <AssetPreview media={media} />
            <CardContent>
                <Typography variant="h6">{title}</Typography>
            </CardContent>
        </BlankCard>
    );
};
