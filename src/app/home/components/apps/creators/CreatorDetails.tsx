import { CircularProgress, Grid, Switch } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import emailIcon from 'public/images/breadcrumb/emailSv.png';
import { websocketSelector } from '@/features/ws';
import { useDispatch, useSelector } from '@/store/hooks';
import { updateVaultStatethunk } from '@/features/creator/thunks';

interface Props {
    creatorId: string;
    onDeleteClick(params: { id: string; email: string }): void;
}

export default function CreatorDetails({ creatorId }: Props) {
    const dispatch = useDispatch();
    const { creatorsOnline = [] } = useSelector(websocketSelector(['creatorsOnline']));
    const { byId, status } = useSelector((state) => state.creator);
    const creator = byId[creatorId];

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
                                        {(
                                            creator.name ||
                                            (creator.emails?.length > 0 && creator.emails[0]?.email) ||
                                            ''
                                        )
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

                            <Grid container>
                                <Grid item lg={6} xs={12} mt={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Email address
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                                        {creator.emails.map((item) => (
                                            <span key={item.email}>
                                                {item.email}
                                                <br />
                                            </span>
                                        ))}
                                    </Typography>
                                </Grid>
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
