import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CircularProgress, Grid, Switch } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconPencil, IconStar, IconTrash } from '@tabler/icons-react';

import emailIcon from 'public/images/breadcrumb/emailSv.png';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';
import { useDispatch } from '@/store/hooks';
import { apiService } from '@/services/api';
import { CreatorType } from '@/mock/creators';
import { RoleType } from '@/mock/roles';
import { websocketSelector } from '@/features/ws';
import { getAssetStatusByCreatorIdThunk, updateAssetStatusByCreatorByIdThunk } from '@/features/assets/thunks';

const creatorSchemaValidation = yup.object({
    name: yup.string().required('field name is required.'),
});

interface Props {
    creatorId: string;

    onDeleteClick(params: { id: string; email: string }): void;
}

export default function CreatorDetails({ creatorId, onDeleteClick }: Props) {
    const dispatch = useDispatch();

    const { creatorsOnline = [] } = useSelector(websocketSelector(['creatorsOnline']));

    const [creator, setCreator] = useState<CreatorType | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [starred, setStarred] = useState(false);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    const [status, setStatus] = useState<string | undefined>('active');
    const [toastr, setToastr] = useState<CustomizedSnackbarState>({
        type: 'success',
        open: false,
        message: '',
    });

    useEffect(() => {
        if (creatorId) {
            const getCreator = async () => {
                const response = await apiService.get<CreatorType>(`/creators/${creatorId}`);

                if (response.data) setCreator(response.data);
            };

            getCreator();
        }

        if (!creatorId) setCreator(null);
    }, [creatorId]);

    const { values, setFieldValue } = useFormik<{ name: string; roles: string[] }>({
        validationSchema: creatorSchemaValidation,
        initialValues: {
            name: '',
            roles: [],
        },
        onSubmit: async (payload) => {},
    });

    useEffect(() => {
        if (creator) {
            setFieldValue('name', creator.name);
            setFieldValue('roles', creator.roles);
            setStatus('');
            setIsLoadingStatus(true);
            dispatch(getAssetStatusByCreatorIdThunk({ creatorId: creator._id }))
                .then((response) => {
                    setStatus(response.data);
                    setIsLoadingStatus(false);
                })
                .catch(() => {
                    setIsLoadingStatus(false);
                    setStatus(undefined);
                });
        }
    }, [creator]);

    const handleUpdateStatusAssetCreator = async ({ checked }: { checked: boolean }) => {
        if (!creator) return;

        setIsLoadingStatus(true);

        const statusChanged = checked ? 'locked' : 'active';
        dispatch(
            updateAssetStatusByCreatorByIdThunk({
                creatorId: creator._id,
                status: statusChanged,
            })
        )
            .then(() => {
                setToastr({
                    open: true,
                    type: 'success',
                    message: 'Status updated successfully.',
                });
                setStatus(statusChanged);
                setIsLoadingStatus(false);
            })
            .catch((err) => {
                if (err instanceof AxiosError && err?.response?.status === 404) {
                    setToastr({
                        open: true,
                        type: 'error',
                        message: 'Asset not found from creator.',
                    });
                }
                setStatus(statusChanged);
                setIsLoadingStatus(false);
            });
    };

    const warningColor = '#FFAE1F';

    return (
        <>
            {creator ? (
                <>
                    <Box p={3} py={2} display={'flex'} alignItems="center">
                        <Typography variant="h5">Creator Details</Typography>
                        {!isEditing ? (
                            <Stack gap={0} direction="row" ml={'auto'}>
                                <Tooltip title={starred ? 'Unstar' : 'Star'}>
                                    <IconButton onClick={() => setStarred(!starred)}>
                                        <IconStar
                                            stroke={1.3}
                                            size="18"
                                            style={{
                                                fill: starred ? warningColor : '',
                                                stroke: starred ? warningColor : '',
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => {}}>
                                        <IconPencil size="18" stroke={1.3} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() =>
                                            onDeleteClick({
                                                id: creator._id,
                                                email: creator.emails[0].email,
                                            })
                                        }
                                    >
                                        <IconTrash size="18" stroke={1.3} />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        ) : null}
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
                                        {(values.name || (creator.emails?.length > 0 && creator.emails[0]?.email) || '')
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
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="h6" mb={0.5}>
                                        {creator.name}
                                    </Typography>
                                    {creator.roles.join('; ')}
                                    <Typography variant="body2" color="text.secondary" mb={0.5}></Typography>
                                </Box>
                            </Box>

                            <Grid container>
                                <Grid item lg={4} xs={12} mt={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Status Consign Artwork
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Switch
                                            checked={status === 'locked'}
                                            disabled={isLoadingStatus}
                                            onChange={(event) =>
                                                handleUpdateStatusAssetCreator({ checked: event.target.checked })
                                            }
                                        />
                                        <p>{status === 'locked' ? 'Locked' : 'Unlocked'}</p>
                                        {isLoadingStatus && <CircularProgress size={20} />}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item lg={6} xs={12} mt={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Phone Number
                                    </Typography>
                                    <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                                        empty
                                    </Typography>
                                </Grid>
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
                                <Grid item lg={6} xs={12} mt={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Language
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                                        Portuguese
                                    </Typography>
                                </Grid>
                                <Grid item lg={6} xs={12} mt={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Location
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                                        Brazil
                                    </Typography>
                                </Grid>
                            </Grid>
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

            <CustomizedSnackbar
                type={toastr.type}
                open={toastr.open}
                message={toastr.message}
                setOpentate={setToastr}
            />
        </>
    );
}
