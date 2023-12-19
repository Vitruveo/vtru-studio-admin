import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconPencil, IconStar, IconTrash, IconDeviceFloppy } from '@tabler/icons-react';

import emailIcon from 'public/images/breadcrumb/emailSv.png';
import RolePermissionsTable from './RolePermissions';
import { RoleType } from '@/mock/roles';
import { apiService } from '@/services/api';
import { PermissionType } from '@/mock/permissions';
import { useDispatch } from '@/store/hooks';
import { roleUpdateThunk } from '@/features/role';

import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import BlankCard from '../../shared/BlankCard';
import Scrollbar from '../../custom-scroll/Scrollbar';

const roleSchemaValidation = yup.object({
    name: yup.string().min(3, 'name field needs at least 3 characters').required('field name is required.'),
});

interface Props {
    roleId: string;
    permissions: PermissionType[];

    onDeleteClick(params: { id: string; name: string }): void;
    handleUpdateRole(params: { id: string; name: string; description: string; permissions: string[] }): void;
}

export default function RoleDetails({ roleId, permissions, onDeleteClick, handleUpdateRole }: Props) {
    const dispatch = useDispatch();

    const [role, setRole] = useState<RoleType | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [starred, setStarred] = useState(false);

    useEffect(() => {
        if (roleId) {
            const getRole = async () => {
                const response = await apiService.get<RoleType>(`/roles/${roleId}`);

                if (response.data) setRole(response.data);
            };

            getRole();
        }

        if (!roleId) setRole(null);
    }, [roleId]);

    const { values, errors, setFieldValue, handleSubmit, handleChange } = useFormik<Omit<RoleType, '_id'>>({
        validationSchema: roleSchemaValidation,
        initialValues: {
            name: '',
            description: '',
            permissions: [],
        },
        onSubmit: async (payload) => {
            if (role?._id) {
                await dispatch(
                    roleUpdateThunk({
                        _id: role._id,
                        ...payload,
                    })
                );

                if (isEditing) {
                    const getRole = async () => {
                        const response = await apiService.get<RoleType>(`/roles/${roleId}`);

                        if (response.data) {
                            setRole(response.data);
                            setIsEditing(false);
                        }
                    };

                    getRole();
                }
                handleUpdateRole({
                    id: roleId,
                    name: payload.name,
                    description: payload.description,
                    permissions: payload.permissions,
                });
            }
        },
    });

    useEffect(() => {
        if (role) {
            setFieldValue('name', role.name);
            setFieldValue('description', role.description);
            setFieldValue('permissions', role.permissions);
        }
    }, [role]);

    const handleChangePermission = (permissionKey: string) => {
        if (values.permissions.includes(permissionKey)) {
            setFieldValue(
                'permissions',
                values.permissions.filter((item) => item !== permissionKey)
            );

            return;
        }

        setFieldValue('permissions', [...values.permissions, permissionKey]);
    };

    const warningColor = '#FFAE1F';

    return (
        <>
            {role ? (
                <>
                    <Box p={3} py={2} display={'flex'} alignItems="center">
                        <Typography variant="h5">Role Details</Typography>
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
                                    <IconButton onClick={() => setIsEditing(!isEditing)}>
                                        <IconPencil size="18" stroke={1.3} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() =>
                                            onDeleteClick({
                                                id: role._id,
                                                name: role.name,
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
                        {!isEditing ? (
                            <Box>
                                <form onSubmit={handleSubmit}>
                                    <Box p={3}>
                                        <Box display="flex" alignItems="center">
                                            <Avatar
                                                alt=""
                                                src=""
                                                sx={{
                                                    width: '72px',
                                                    height: '72px',
                                                }}
                                            >
                                                {values.name.slice(0, 2).toUpperCase()}
                                            </Avatar>
                                            <Box sx={{ ml: 2 }}>
                                                <Typography variant="h6" mb={0.5}>
                                                    {role.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                                    {role.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box p={3}>
                                        <RolePermissionsTable
                                            permissions={permissions}
                                            activePermissions={values.permissions}
                                            handleChangePermission={handleChangePermission}
                                        />
                                    </Box>

                                    <Box p={3} gap={1} display="flex" justifyContent="flex-end">
                                        <Button color="primary" variant="contained" size="small" type="submit">
                                            Save
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        ) : (
                            <>
                                <BlankCard sx={{ p: 0 }}>
                                    <Scrollbar
                                        sx={{
                                            height: {
                                                lg: 'calc(100vh - 360px)',
                                                md: '100vh',
                                            },
                                        }}
                                    >
                                        <Box pt={1}>
                                            <form onSubmit={handleSubmit}>
                                                <Box p={3}>
                                                    <Typography variant="h6" mb={0.5}>
                                                        Editing role
                                                    </Typography>
                                                    <Box>
                                                        <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                                                        <CustomTextField
                                                            name="name"
                                                            id="name"
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            value={values.name}
                                                            onChange={handleChange}
                                                        />
                                                        {errors?.name && <span>{errors.name}</span>}
                                                    </Box>

                                                    <Box>
                                                        <CustomFormLabel htmlFor="description">
                                                            Description
                                                        </CustomFormLabel>
                                                        <CustomTextField
                                                            name="description"
                                                            id="description"
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            value={values.description}
                                                            onChange={handleChange}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Divider />
                                                <Box p={3} gap={1} display="flex" justifyContent="flex-end">
                                                    <Button
                                                        color="error"
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => setIsEditing(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        size="small"
                                                        type="submit"
                                                    >
                                                        Save
                                                    </Button>
                                                </Box>
                                            </form>
                                        </Box>
                                    </Scrollbar>
                                </BlankCard>
                            </>
                        )}
                    </Box>
                </>
            ) : (
                <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
                    <Box>
                        <Typography variant="h4">Please Select a Role</Typography>
                        <br />
                        <Image src={emailIcon} alt={'emailIcon'} width="250" />
                    </Box>
                </Box>
            )}
        </>
    );
}
