import { useState } from 'react';
import { Theme } from '@mui/material/styles';
import { IconChecklist, IconDeselect, IconLock, IconMenu2 } from '@tabler/icons-react';
import { AssetType } from '@/app/home/types/apps/asset';
import { AssetCard } from '@/app/home/components/apps/assets/asset-card/assetCard';
import { buildAssetSource } from '@/utils/assets';
import { Checkbox, FormControlLabel, Box, Button, Fab, Grid, Stack, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useArray } from '@/app/hooks/use-array';
import { ConfirmationDialog } from './ConfirmationDialog';
import { IconSelectAll } from '@tabler/icons-react';
import AssetSearch from './AssetSearch';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import emptyCart from 'public/images/products/empty-shopping-cart.svg';
import { useDispatch, useSelector } from '@/store/hooks';
import { updateManyAssetsStatusByIdsThunk } from '@/features/assets/thunks';
import { assetActionsCreators } from '@/features/assets';
import { creatorActionsCreators } from '@/features/creator';

interface Props {
    onClick: (event: React.SyntheticEvent | Event) => void;
    onChangeSearch: (value: string) => void;
    assets: AssetType[];
    loading: boolean;
}

const AssetList = ({ onClick, onChangeSearch, assets, loading }: Props) => {
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const router = useRouter();
    const dispatch = useDispatch();

    const [isSelecting, setIsSelecting] = useState(false);
    const selectedAssetsIds = useArray<string>([]);
    const selectedFilter = useSelector((state) => state.asset.filter);

    const onSelectingChange = () => {
        setIsSelecting((prev) => !prev);
    };

    const onCardClick = (asset: AssetType, status: ReturnType<typeof getAssetStatus>) => {
        if (isSelecting) {
            if (status === undefined) {
                return;
            }

            if (!selectedAssetsIds.state.includes(asset._id)) {
                selectedAssetsIds.push(asset._id);
                return;
            }
            selectedAssetsIds.removeByValue(asset._id);
            return;
        }

        dispatch(assetActionsCreators.setAsset(asset));
        if (asset?.creator) dispatch(creatorActionsCreators.setCreator(asset.creator));

        router.push(`asset/${asset._id}`);
    };

    const isAssetSelected = (id: string) => selectedAssetsIds.state.includes(id);

    const getAssetStatus = (asset: AssetType) => {
        if (asset?.consignArtwork?.status === 'blocked') {
            return 'blocked';
        }

        if (asset?.consignArtwork?.status === 'active') {
            return 'active';
        }

        return undefined;
    };

    const onSelectAll = () => {
        setIsSelecting(true);
        assets.forEach((asset) => {
            if (!selectedAssetsIds.state.includes(asset._id)) {
                selectedAssetsIds.push(asset._id);
            }
        });
    };

    const onClearSelectionConfirm = () => {
        setIsSelecting(true);
        selectedAssetsIds.clear();
    };

    const selectedCount = selectedAssetsIds.state.length;

    const onActivateSelection = () => {
        dispatch(updateManyAssetsStatusByIdsThunk({ ids: selectedAssetsIds.state, status: 'active' }));
        selectedAssetsIds.clear();
    };

    const onBlockSelectionConsign = () => {
        dispatch(updateManyAssetsStatusByIdsThunk({ ids: selectedAssetsIds.state, status: 'blocked' }));
        selectedAssetsIds.clear();
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" pb={3}>
                <Stack direction="row" alignItems="center" gap={2}>
                    {lgUp ? (
                        <Typography variant="h5">Assets</Typography>
                    ) : (
                        <Fab onClick={onClick} color="primary" size="small">
                            <IconMenu2 width="16" />
                        </Fab>
                    )}
                </Stack>
            </Stack>

            <Typography>{isSelecting ? `${selectedCount} selected` : ''}</Typography>

            <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={1} mb={4}>
                <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
                    <FormControlLabel
                        control={<Checkbox size="small" checked={isSelecting} onChange={onSelectingChange} />}
                        label="Select multiple"
                    />
                    <Button startIcon={<IconSelectAll />} onClick={onSelectAll}>
                        Select all
                    </Button>
                    <ConfirmationDialog
                        onConfirm={onClearSelectionConfirm}
                        title="Clear selection"
                        description="Are you sure you want to clear the selection? This action will clear all selected assets including the other pages."
                    >
                        {(open) => (
                            <Button
                                startIcon={<IconDeselect />}
                                onClick={() => selectedAssetsIds.state.length > 0 && open()}
                            >
                                Clear selection
                            </Button>
                        )}
                    </ConfirmationDialog>
                    {selectedFilter !== 'active' && (
                        <ConfirmationDialog
                            onConfirm={onActivateSelection}
                            title="Activate selection"
                            description="Are you sure you want activate the selected assets?"
                        >
                            {(open) => (
                                <Button startIcon={<IconChecklist />} onClick={open}>
                                    Activate
                                </Button>
                            )}
                        </ConfirmationDialog>
                    )}
                    {selectedFilter !== 'blocked' && (
                        <ConfirmationDialog
                            onConfirm={onBlockSelectionConsign}
                            title="Block Selection"
                            description="Are you sure you want to block the selected assets?"
                        >
                            {(open) => (
                                <Button startIcon={<IconLock />} onClick={open}>
                                    Block
                                </Button>
                            )}
                        </ConfirmationDialog>
                    )}
                </Stack>
                <AssetSearch onChange={(event) => onChangeSearch(event.target.value)} />
            </Stack>

            {loading && (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            )}

            {!loading && (
                <Grid container spacing={8} justifyContent="center">
                    {assets.length > 0 ? (
                        <>
                            {assets.map((asset) => {
                                const assetsStatus = getAssetStatus(asset);

                                return (
                                    <Grid item display="flex" flexWrap={'wrap'} alignItems="stretch" key={asset._id}>
                                        <AssetCard
                                            creator={asset?.assetMetadata?.creators?.formData?.[0]?.name}
                                            onClick={() => onCardClick(asset, assetsStatus)}
                                            isLoading={loading}
                                            title={asset?.assetMetadata?.context?.formData?.title ?? 'Untitled'}
                                            media={buildAssetSource(asset?.formats?.preview?.path)}
                                            status={assetsStatus}
                                            variant={
                                                isSelecting && assetsStatus != undefined ? 'selectable' : 'default'
                                            }
                                            isSelected={isAssetSelected(asset._id)}
                                            isConsigned={asset?.contractExplorer?.explorer?.length > 0}
                                        />
                                    </Grid>
                                );
                            })}
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
            )}
        </Box>
    );
};

export default AssetList;
