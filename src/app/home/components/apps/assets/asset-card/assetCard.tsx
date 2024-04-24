'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IconLock } from '@tabler/icons-react';
import { Typography, CardContent, Skeleton, Box } from '@mui/material';
import BlankCard from '../../../shared/BlankCard';
import { AssetPreview } from '../asset-preview/assetPreview';

interface AssetCardProps {
    id: string;
    media?: string;
    title: string;
    isLoading?: boolean;
    isBlocked?: boolean;
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

export const AssetCard = ({ id, media, title, isLoading, isBlocked }: AssetCardProps) => {
    const router = useRouter();

    if (isLoading) return <AssetSkeleton />;

    return (
        <Box onClick={() => router.push(`asset/${id}`)} minWidth={250} maxWidth={250} sx={{ cursor: 'pointer' }}>
            <BlankCard className="hoverCard">
                <AssetPreview media={media} />
                <CardContent>
                    {isBlocked && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconLock style={{ marginBottom: 7 }} width={20} />
                            <Typography variant="body2">Blocked</Typography>
                        </Box>
                    )}
                    <Typography variant="h6">{title}</Typography>
                </CardContent>
            </BlankCard>
        </Box>
    );
};
