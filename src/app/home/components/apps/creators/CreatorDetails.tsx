import { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Grid, Pagination, Switch, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import emailIcon from 'public/images/breadcrumb/emailSv.png';
import { websocketSelector } from '@/features/ws';
import { useDispatch, useSelector } from '@/store/hooks';
import { updateLicenseThunk, updateVaultStatethunk } from '@/features/creator/thunks';
import { BASE_URL_STORE } from '@/constants/api';
import { AssetType } from '@/app/home/types/apps/asset';
import { localePrice } from '@/utils/locale/date';
import { getAssetsByCreatorIdThunk, setPageThunk } from '@/features/assets/thunks';

interface Props {
    creatorId: string;
    onDeleteClick?(params: { id: string; email: string }): void;
    hiddenPreview?: boolean;
    hiddenCreatorName?: boolean;
}

export default function CreatorDetails({ creatorId, hiddenPreview = false }: Props) {
    const dispatch = useDispatch();
    const { creatorsOnline = [] } = useSelector(websocketSelector(['creatorsOnline']));
    const { status } = useSelector((state) => state.creator);
    const creator = useSelector((state) => state.creator.byId[creatorId]);
    const assets = useSelector((state) =>
        state.asset.allIds
            .map((id) => state.asset.byId[id])
            .filter((asset) => asset?.framework?.createdBy === creatorId)
    );
    const { page, totalPage } = useSelector((state) => state.asset);
    const topRef = useRef<HTMLDivElement>(null);

    const [licenses, setLicenses] = useState({
        artCards: creator?.licenses?.artCards ?? 3,
    });

    useEffect(() => {
        setLicenses({
            artCards: creator?.licenses?.artCards ?? 3,
        });
    }, [creator]);

    useEffect(() => {
        dispatch(getAssetsByCreatorIdThunk(creatorId));
        dispatch(setPageThunk(1));
    }, [creatorId]);

    useEffect(() => {
        if (topRef.current) topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const handleClickPreview = (item: AssetType) => {
        if (item) {
            const URL = `${BASE_URL_STORE}/${
                item.consignArtwork?.status === 'active' ? creator?.username : 'preview'
            }/${item._id}`;
            window.open(URL, '_blank');
        }
    };

    if (!creator) {
        return (
            <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
                <Box>
                    <Typography variant="h4">Please Select a Creator</Typography>
                    <br />
                    <Image src={emailIcon} alt={'emailIcon'} width="250" />
                </Box>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Box p={1} display={'flex'} alignItems="center">
                <Typography variant="h5">Creator Details</Typography>
            </Box>

            <Box p={1}>
                <Box display="flex" alignItems="center">
                    <Box position="relative">
                        <Avatar
                            alt=""
                            src=""
                            sx={{
                                width: '72px',
                                height: '72px',
                            }}
                        >
                            {((creator.emails?.length > 0 && creator.emails[0]?.email) || '').slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box
                            position="absolute"
                            width="25px"
                            height="25px"
                            borderRadius="50%"
                            border="2px solid #fff"
                            bgcolor={creatorsOnline.some((item) => item._id === creatorId) ? '#13DEB9' : '#f3704d'}
                            bottom={-2}
                            right={4}
                        ></Box>
                    </Box>
                    <Box pl={1}>
                        <Typography variant="h6" mb={0.5}>
                            {creator.username}
                        </Typography>
                    </Box>
                </Box>

                <Grid container display={'flex'} flexDirection={'column'}>
                    <Grid item lg={6} xs={12} mt={2}>
                        <Typography variant="body2" color="text.secondary">
                            Email address
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                            {creator.emails.map((item: any) => (
                                <span key={item.email}>
                                    {item.email}
                                    <br />
                                </span>
                            ))}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
            </Box>

            <Box>
                <Typography variant="h5" p={1} pb={1}>
                    Creator Vault
                </Typography>
                <Box p={1} pt={0}>
                    <Typography variant="body2" color="text.secondary">
                        Vault Address
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {creator?.vault?.vaultAddress ?? 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        State
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Switch
                            checked={!creator?.vault?.isBlocked}
                            onChange={() => dispatch(updateVaultStatethunk({ id: creatorId }))}
                            disabled={!creator?.vault?.vaultAddress || status === 'loading'}
                        />
                        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                            {creator?.vault?.isBlocked ? 'Blocked' : 'Active'}
                        </Typography>
                        {status === 'loading' && <CircularProgress size={20} />}
                    </Box>
                </Box>
                <Divider />
            </Box>

            <Box>
                <Typography variant="h5" p={1} pb={1}>
                    Licenses Art Cards
                </Typography>
                <Box p={1} pt={2} display="flex" gap={2}>
                    <TextField
                        label="Total Licenses"
                        size="small"
                        type="number"
                        value={licenses.artCards}
                        onChange={(e) => setLicenses({ ...licenses, artCards: Number(e.target.value) })}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            dispatch(
                                updateLicenseThunk(creator._id, {
                                    license: 'artCards',
                                    value: licenses.artCards,
                                })
                            );
                        }}
                    >
                        Save
                    </Button>
                </Box>
                <Divider />
            </Box>

            {!hiddenPreview && assets.length > 0 && (
                <Box p={1}>
                    <Typography variant="h5">Creator Assets</Typography>

                    <Box
                        sx={{
                            width: '100%',
                            maxHeight: '29vh',
                            overflowY: 'auto',
                        }}
                        ref={topRef}
                    >
                        <Box>
                            {assets.map((item, index) => (
                                <Box pt={1} key={index}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {item.assetMetadata?.context?.formData?.title || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" fontWeight={600}>
                                                {localePrice(item.licenses?.nft?.single?.editionPrice)}
                                            </Typography>
                                        </Box>
                                        <Button onClick={() => handleClickPreview(item)}>
                                            <Typography>Preview</Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Pagination
                        count={totalPage}
                        page={page}
                        color="primary"
                        onChange={(_event, value) => {
                            dispatch(getAssetsByCreatorIdThunk(creatorId, value));
                            dispatch(setPageThunk(value));
                        }}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: 2,
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
