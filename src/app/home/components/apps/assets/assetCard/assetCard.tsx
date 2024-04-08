import React from 'react';
import { Typography, CardContent, Skeleton } from '@mui/material';
import BlankCard from '../../../shared/BlankCard';

interface AssetCardProps {
    media?: string;
    title: string;
    isLoading?: boolean;
}

export const AssetCard = ({ media, title, isLoading }: AssetCardProps) => {
    if (isLoading)
        return (
            <Skeleton
                variant="rectangular"
                width={270}
                height={300}
                sx={{
                    borderRadius: (theme) => theme.shape.borderRadius / 5,
                }}
            ></Skeleton>
        );

    return (
        <BlankCard className="hoverCard">
            {media ? (
                <img src={media} alt="img" height={268} style={{ maxWidth: '100%' }} />
            ) : (
                <Skeleton
                    variant="rectangular"
                    width='100%'
                    height={268}
                    sx={{
                        borderRadius: (theme) => theme.shape.borderRadius / 5,
                    }}
                ></Skeleton>
            )}
            <CardContent sx={{ p: 3, pt: 2 }}>
                <Typography variant="h6">{title}</Typography>
            </CardContent>
        </BlankCard>
    );
};
