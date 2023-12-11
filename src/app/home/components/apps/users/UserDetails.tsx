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
import { IconPencil, IconStar, IconTrash, IconFilter } from '@tabler/icons-react';

import emailIcon from 'public/images/breadcrumb/emailSv.png';
import { useEffect, useMemo, useState } from 'react';
import { apiService } from '@/app/services/api';

import { useDispatch } from '@/store/hooks';
import { userUpdateThunk } from '@/features/user';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import BlankCard from '../../shared/BlankCard';
import Scrollbar from '../../custom-scroll/Scrollbar';
import { UserType } from '@/mock/users';
import { FormLabel, Grid, TextField } from '@mui/material';
import UserRolesTable from './UserRoles';
import { RoleType } from '@/mock/roles';

const userSchemaValidation = yup.object({
  name: yup.string().required('field name is required.'),
});

interface Props {
  userId: string;
  roles: RoleType[];

  onDeleteClick(params: { id: string; email: string }): void;
  handleUpdateUser(params: { id: string; name: string }): void;
}

export default function UserDetails({ roles, userId, onDeleteClick, handleUpdateUser }: Props) {
  const dispatch = useDispatch();

  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [starred, setStarred] = useState(false);

  const [inputFilter, setInputFilter] = useState('');
  const [isOpenFilters, setIsOpenFilters] = useState(false);

  useEffect(() => {
    if (userId) {
      const getUser = async () => {
        const response = await apiService.get<UserType>(`/users/${userId}`);

        if (response.data) setUser(response.data);
      };

      getUser();
    }

    if (!userId) setUser(null);
  }, [userId]);

  const { values, errors, setFieldValue, handleSubmit, handleChange } = useFormik<{ name: string; roles: string[] }>({
    validationSchema: userSchemaValidation,
    initialValues: {
      name: '',
      roles: [],
    },
    onSubmit: async (payload) => {
      if (user?._id) {
        await dispatch(
          userUpdateThunk({
            _id: user._id,
            name: payload.name,
            roles: payload.roles,
            email: user.login.email,
          }),
        );

        if (isEditing) {
          const getUser = async () => {
            const response = await apiService.get<UserType>(`/users/${userId}`);

            if (response.data) {
              setUser(response.data);
              setIsEditing(false);
            }
          };

          getUser();
        }
        handleUpdateUser({
          id: userId,
          name: payload.name,
        });
      }
    },
  });

  useEffect(() => {
    if (user) {
      setFieldValue('name', user.name);
      setFieldValue('roles', user.roles);
    }
  }, [user]);

  const warningColor = '#FFAE1F';

  const rolesFiltered = useMemo(() => {
    return inputFilter.length > 0
      ? roles.filter((role) => role.name.toLowerCase().includes(inputFilter.toLowerCase()))
      : [];
  }, [inputFilter]);

  return (
    <>
      {user ? (
        <>
          <Box p={3} py={2} display={'flex'} alignItems="center">
            <Typography variant="h5">User Details</Typography>
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
                        id: user._id,
                        email: user.login.email,
                      })
                    }>
                    <IconTrash size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : null}
          </Box>
          <Divider />

          <Box sx={{ overflow: 'auto' }}>
            {!isEditing ? (
              <Box p={3}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    alt=""
                    src=""
                    sx={{
                      width: '72px',
                      height: '72px',
                    }}>
                    {(values.name || user.login.email).slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" mb={0.5}>
                      {user.name}
                    </Typography>
                    {user.roles.join('; ')}
                    <Typography variant="body2" color="text.secondary" mb={0.5}></Typography>
                  </Box>
                </Box>

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
                      {user.login.email}
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
            ) : (
              <>
                <BlankCard sx={{ p: 0 }}>
                  <Scrollbar
                    sx={{
                      height: {
                        lg: 'calc(100vh - 360px)',
                        md: '100vh',
                      },
                    }}>
                    <Box pt={1}>
                      <form onSubmit={handleSubmit}>
                        <Box p={3}>
                          <Typography variant="h6" mb={0.5}>
                            Editing user
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

                          <Box display="flex" justifyContent="space-between">
                            <CustomFormLabel htmlFor="roles">Roles</CustomFormLabel>
                            <Tooltip title="Filter">
                              <IconButton onClick={() => setIsOpenFilters(!isOpenFilters)}>
                                <IconFilter size="18" stroke={1.3} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          {isOpenFilters && (
                            <Grid paddingBottom={3} spacing={3} container>
                              <Grid item xs={12} lg={4}>
                                <FormLabel>Name</FormLabel>
                                <TextField
                                  onChange={(e) => setInputFilter(e.target.value)}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                />
                              </Grid>
                            </Grid>
                          )}
                          <UserRolesTable
                            roles={(inputFilter.length > 0 && rolesFiltered) || roles}
                            activeRoles={values.roles}
                            handleChangeRole={(roleId) => {
                              if (values.roles.includes(roleId)) {
                                setFieldValue(
                                  'roles',
                                  values.roles.filter((item) => item !== roleId),
                                );

                                return;
                              }
                              setFieldValue('roles', [...values.roles, roleId]);
                            }}
                          />
                        </Box>

                        <Divider />
                        <Box p={3} gap={1} display="flex" justifyContent="flex-end">
                          <Button color="error" variant="outlined" size="small" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button color="primary" variant="contained" size="small" type="submit">
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
            <Typography variant="h4">Please Select a User</Typography>
            <br />
            <Image src={emailIcon} alt={'emailIcon'} width="250" />
          </Box>
        </Box>
      )}
    </>
  );
}
