'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import UserDetails from '@/app/home/components/apps/users/UserDetails';
import UserList from '@/app/home/components/apps/users/UserList';
import UserSearch from '@/app/home/components/apps/users/UserSearch';
import UserFilter from '@/app/home/components/apps/users/UserFilter';
import AppCard from '@/app/home/components/shared/AppCard';
import { useDispatch, useSelector } from '@/store/hooks';
import { userDeleteThunk } from '@/features/user/slice';

import UserAdd from '../../components/apps/users/UserAdd';

import { UserDialogDelete } from '../../components/apps/users/UserDialogDelete';
import { userAddThunk, userGetThunk, userUpdateThunk } from '@/features/user/thunks';
import { roleGetThunk } from '@/features/role/thunks';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Users() {
    const dispatch = useDispatch();

    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const users = useSelector((state) => state.user.allIds.map((id) => state.user.byId[id]));
    const usersById = useSelector((state) => state.user.byId);
    const roles = useSelector((state) => state.role.allIds.map((id) => state.role.byId[id]));

    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [userDelete, setUserDelete] = useState({ email: '', id: '' });

    useEffect(() => {
        dispatch(userGetThunk());
        dispatch(roleGetThunk());
    }, []);

    const usersFiltered = useMemo(() => {
        return search.length > 0
            ? users.filter(
                  (user) =>
                      user.name.toLowerCase().includes(search.toLowerCase()) ||
                      user.login.email.toLowerCase().includes(search.toLowerCase())
              )
            : [];
    }, [search, users]);

    const onDeleteClick = ({ id, email }: { id: string; email: string }) => {
        setIsOpenDialogDelete(true);
        setUserDelete({ id, email });
    };

    const onDeleteConfirm = () => {
        const { id } = userDelete;

        dispatch(userDeleteThunk({ _id: id }));
        if (id === userId) setUserId('');

        setIsOpenDialogDelete(false);
    };

    const handleAddNewUser = useCallback(({ id, name, email }: { id: string; name: string; email: string }) => {
        dispatch(userAddThunk({ name, login: { email } }));
        setUserId(id);
    }, []);

    const handleUpdateUser = useCallback(({ id, name }: { id: string; name: string }) => {
        dispatch(userUpdateThunk({ ...usersById[id], _id: id, name }));
    }, []);

    return (
        <PageContainer title="User" description="this is Users">
            <Breadcrumb title="Users Application" subtitle="List Your Users" />
            <AppCard>
                <Drawer
                    open={isLeftSidebarOpen}
                    onClose={() => setLeftSidebarOpen(false)}
                    sx={{
                        width: drawerWidth,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            position: 'relative',
                            zIndex: 2,
                        },
                        flexShrink: 0,
                    }}
                    variant={lgUp ? 'permanent' : 'temporary'}
                >
                    <UserAdd handleAddNewUser={handleAddNewUser} />
                    <UserFilter />
                </Drawer>

                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}
                >
                    <UserSearch onClick={() => setLeftSidebarOpen(true)} search={search} setSearch={setSearch} />
                    <UserList
                        userId={userId}
                        data={(search.length > 0 && usersFiltered) || users}
                        onDeleteClick={onDeleteClick}
                        onUserClick={({ id }) => setUserId(id)}
                    />
                </Box>

                <Drawer
                    anchor="right"
                    open={isRightSidebarOpen}
                    onClose={() => setRightSidebarOpen(false)}
                    variant={mdUp ? 'permanent' : 'temporary'}
                    sx={{
                        width: mdUp ? secdrawerWidth : '100%',
                        zIndex: lgUp ? 0 : 1,
                        flex: mdUp ? 'auto' : '',
                        [`& .MuiDrawer-paper`]: { width: '100%', position: 'relative' },
                    }}
                >
                    {mdUp ? (
                        ''
                    ) : (
                        <Box sx={{ p: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => setRightSidebarOpen(false)}
                                sx={{ mb: 3, display: { xs: 'block', md: 'none', lg: 'none' } }}
                            >
                                Back{' '}
                            </Button>
                        </Box>
                    )}
                    <UserDetails
                        roles={roles}
                        userId={userId}
                        onDeleteClick={onDeleteClick}
                        handleUpdateUser={handleUpdateUser}
                    />
                </Drawer>
            </AppCard>

            <UserDialogDelete
                userName={userDelete.email}
                isOpen={isOpenDialogDelete}
                handleCancel={() => setIsOpenDialogDelete(!isOpenDialogDelete)}
                handleConfirm={onDeleteConfirm}
            />
        </PageContainer>
    );
}
