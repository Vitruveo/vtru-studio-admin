'use client';
import { IconLock, IconChecklist, IconFileUnknown } from '@tabler/icons-react';
import { Typography, CardContent, Skeleton, Box, Checkbox, Stack } from '@mui/material';
import BlankCard from '../../../shared/BlankCard';
import { AssetPreview } from '../asset-preview/assetPreview';

interface AssetCardProps {
    media?: string;
    title: string;
    isLoading?: boolean;
    variant?: 'default' | 'selectable';
    onClick?: (event: React.SyntheticEvent | Event) => void;
    isSelected?: boolean;
    status?: 'active' | 'blocked';
    creator?: string;
    isConsigned?: boolean;
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

export const AssetCard = ({
    media,
    title,
    isLoading,
    status,
    variant,
    isSelected,
    creator,
    onClick,
    isConsigned,
}: AssetCardProps) => {
    if (isLoading) return <AssetSkeleton />;

    return (
        <Box onClick={onClick} minWidth={250} maxWidth={250} sx={{ cursor: 'pointer' }}>
            <BlankCard className="hoverCard">
                <AssetPreview media={media} />
                <CardContent>
                    <Box mb={2}>{variant === 'selectable' && <Checkbox checked={isSelected} sx={{ p: 0 }} />}</Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            {status == 'blocked' && (
                                <>
                                    <IconLock style={{ marginBottom: 7 }} width={20} />
                                    <Typography variant="body2">Blocked</Typography>
                                </>
                            )}
                            {status == 'active' && (
                                <>
                                    <IconChecklist style={{ marginBottom: 7 }} width={20} />
                                    <Typography variant="body2">Active</Typography>
                                </>
                            )}
                            {!status && (
                                <>
                                    <IconFileUnknown style={{ marginBottom: 7 }} width={20} />
                                    <Typography variant="body2">Unknown</Typography>
                                </>
                            )}
                        </Box>
                        <Stack>
                            {isConsigned && (
                                <Typography variant="body2" color="primary">
                                    Consigned
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                    <Stack gap={1}>
                        <Box title={title}>
                            <Typography overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" variant="h6">
                                {title}
                            </Typography>
                        </Box>
                        <Box title={creator ?? 'No creator'}>
                            <Typography
                                overflow="hidden"
                                fontSize={14}
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                variant="body2"
                            >
                                {creator ?? 'No creator'}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </BlankCard>
        </Box>
    );
};
