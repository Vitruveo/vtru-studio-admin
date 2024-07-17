import { Button, CircularProgress, Grid, Switch } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import emailIcon from 'public/images/breadcrumb/emailSv.png';
import { websocketSelector } from '@/features/ws';
import { useDispatch, useSelector } from '@/store/hooks';
import { updateVaultStatethunk } from '@/features/creator/thunks';
import { AppState } from '@/store';
import { BASE_URL_STORE } from '@/constants/api';
import { AssetType } from '@/app/home/types/apps/asset';
import { localePrice } from '@/utils/locale/date';

const creatorSelector = (state: AppState, creatorId: string) => {
    const creator = state.creator.byId[creatorId];
    if (!creator) return null;

    const assets = Object.values(state.asset?.byId || {})
        .filter((v) => v.framework.createdBy === creatorId)
        .sort((a, b) => {
            if (a?.assetMetadata?.context?.formData?.title && !b?.assetMetadata?.context?.formData?.title) return -1;
            if (!a?.assetMetadata?.context?.formData?.title && b?.assetMetadata?.context?.formData?.title) return 1;
            return 0;
        });

    return {
        ...creator,
        assets,
    };
};

interface Props {
    creatorId: string;
    onDeleteClick?(params: { id: string; email: string }): void;
    hiddenPreview?: boolean;
    hiddenCreatorName?: boolean;
}

export default function CreatorDetails({ creatorId, hiddenPreview = false, hiddenCreatorName = false }: Props) {
    const dispatch = useDispatch();
    const { creatorsOnline = [] } = useSelector(websocketSelector(['creatorsOnline']));
    const { status } = useSelector((state) => state.creator);
    const { byId: assetById } = useSelector((state) => state.asset);
    const creator = useSelector((state) => creatorSelector(state, creatorId));
    const asset = Object.values(assetById || {}).find((v) => v.framework.createdBy === creatorId) || null;

    const handleClickPreview = (item: AssetType) => {
        if (item) {
            const URL = `${BASE_URL_STORE}/${
                item.consignArtwork?.status === 'active' ? creator?.username : 'preview'
            }/${item._id}`;
            window.open(URL, '_blank');
        }
    };

    return (
        <>
            {creator ? (
                <>
                    <Box p={3} py={2} display={'flex'} alignItems="center">
                        <Typography variant="h5">Creator Details</Typography>
                    </Box>
                    <Divider />

                    <Box sx={{ overflow: 'auto' }}>
                        <Box p={3}>
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
                                        {((creator.emails?.length > 0 && creator.emails[0]?.email) || '')
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </Avatar>
                                    <Box
                                        position="absolute"
                                        width="25px"
                                        height="25px"
                                        borderRadius="50%"
                                        border="2px solid #fff"
                                        bgcolor={
                                            creatorsOnline.some((item) => item._id === creatorId)
                                                ? '#13DEB9'
                                                : '#f3704d'
                                        }
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
                                <Grid item lg={6} xs={12} mt={4}>
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
                                {asset?.assetMetadata?.creators?.formData[0] && !hiddenCreatorName && (
                                    <Grid item lg={6} xs={12} mt={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Creator name
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                                            {asset.assetMetadata.creators.formData[0].name}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Box>
                    <Box>
                        <Divider />
                        <Typography variant="h5" p={3} pb={1}>
                            Creator Vault
                        </Typography>
                        <Box p={3} pt={0}>
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
                    </Box>

                    {!hiddenPreview && creator.assets.length > 0 && (
                        <Box>
                            <Divider />
                            <Typography variant="h5" p={3} pb={1}>
                                Creator Assets
                            </Typography>
                            <Box maxHeight={300} overflow={'auto'} mb={2}>
                                {creator.assets.map((item, index) => (
                                    <Box p={3} pt={0} key={index}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {item.assetMetadata?.context?.formData?.title || 'N/A'}
                                                </Typography>
                                                <Typography variant="caption" fontWeight={600}>
                                                    {localePrice(item.licenses?.nft?.single?.editionPrice)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                onClick={() => handleClickPreview(item)}
                                                disabled={!item.assetMetadata?.context?.formData?.title}
                                            >
                                                <Typography>Preview</Typography>
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </>
            ) : (
                <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
                    <Box>
                        <Typography variant="h4">Please Select a Creator</Typography>
                        <br />
                        <Image src={emailIcon} alt={'emailIcon'} width="250" />
                    </Box>
                </Box>
            )}
        </>
    );
}
