import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconMenu2 } from '@tabler/icons-react';
import emptyCart from 'public/images/products/empty-shopping-cart.svg';
import { AssetType } from '@/app/home/types/apps/asset';
import { AssetCard } from '@/app/home/components/apps/assets/asset-card/assetCard';
import AssetSearch from './AssetSearch';
import { buildAssetSource } from '@/utils/assets';
import { useSelector } from '@/store/hooks';

interface Props {
    onClick: (event: React.SyntheticEvent | Event) => void;
    onChangeSearch: (value: string) => void;
    assets: AssetType[];
    isLoading?: boolean;
}

const AssetList = ({ onClick, onChangeSearch, assets, isLoading = false }: Props) => {
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" pb={3}>
                {lgUp ? (
                    <Typography variant="h5">Assets</Typography>
                ) : (
                    <Fab onClick={onClick} color="primary" size="small">
                        <IconMenu2 width="16" />
                    </Fab>
                )}
                <Box>
                    <AssetSearch onChange={(event) => onChangeSearch(event.target.value)} />
                </Box>
            </Stack>

            <Grid container spacing={3}>
                {assets.length > 0 ? (
                    <>
                        {assets.map((asset) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                xl={3}
                                display="flex"
                                alignItems="stretch"
                                key={asset._id}
                            >
                                <AssetCard
                                    id={asset._id}
                                    isLoading={isLoading}
                                    title={asset.assetMetadata?.context?.formData?.title ?? 'Untitled'}
                                    media={buildAssetSource(asset.formats?.preview?.path)}
                                    isBlocked={asset?.consignArtwork?.status === 'blocked'}
                                />
                            </Grid>
                        ))}
                    </>
                ) : (
                    <>
                        <Grid item xs={12} lg={12} md={12} sm={12}>
                            <Box textAlign="center" mt={6}>
                                <Image src={emptyCart} alt="cart" width={200} />
                                <Typography variant="h2">There is no Asset</Typography>
                                <Typography variant="h6" mb={3}>
                                    The Asset you are searching is no longer available.
                                </Typography>
                                <Button variant="contained" onClick={() => {}}>
                                    Try Again
                                </Button>
                            </Box>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
};

export default AssetList;
