import React, { useEffect } from 'react';
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
import AlertCart from '../asset-cart/AlertCart';
import emptyCart from 'public/images/products/empty-shopping-cart.svg';
import { AssetType } from '@/app/home/types/apps/asset';
import { AssetCard } from '@/app/home/components/apps/assets/assetCard/assetCard';
import { ASSET_STORAGE_URL } from '@/constants/asset';
import AssetSearch from './AssetSearch';

interface Props {
    onClick: (event: React.SyntheticEvent | Event) => void;
    assets: AssetType[];
}

const AssetList = ({ onClick, assets }: Props) => {
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const [cartalert, setCartalert] = React.useState(false);

    const handleClose = (reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setCartalert(false);
    };

    // skeleton
    const [isLoading, setLoading] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box>
            {/* ------------------------------------------- */}
            {/* Header Detail page */}
            {/* ------------------------------------------- */}
            <Stack direction="row" justifyContent="space-between" pb={3}>
                {lgUp ? (
                    <Typography variant="h5">Assets</Typography>
                ) : (
                    <Fab onClick={onClick} color="primary" size="small">
                        <IconMenu2 width="16" />
                    </Fab>
                )}
                <Box>
                    <AssetSearch />
                </Box>
            </Stack>

            {/* ------------------------------------------- */}
            {/* Page Listing Asset */}
            {/* ------------------------------------------- */}
            <Grid container spacing={3}>
                {assets.length > 0 ? (
                    <>
                        {assets.map((asset) => (
                            <Grid item xs={12} lg={4} md={4} sm={6} display="flex" alignItems="stretch" key={asset._id}>
                                <AssetCard
                                    isLoading={isLoading}
                                    title={asset.formats?.preview?.name ?? 'Asset without name'}
                                    media={
                                        asset.formats?.preview?.path &&
                                        `${ASSET_STORAGE_URL}/${asset.formats?.preview?.path}`
                                    }
                                />
                                <AlertCart handleClose={handleClose} openCartAlert={cartalert} />
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
