'use client';

import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
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
import { userAddThunk, userGetPaginatedThunk, userUpdateThunk } from '@/features/user/thunks';
import { User } from '@/features/user/types';
import { Role } from '@/features/role/types';
import { roleGetPaginatedThunk } from '@/features/role/thunks';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Users() {
    const dispatch = useDispatch();

    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const usersById = useSelector((state) => state.user.byId);

    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [userDelete, setUserDelete] = useState({ email: '', id: '' });
    const [loadingCreators, setLoadingCreators] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: User[];
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: [],
        total: 0,
        totalPage: 0,
    });
    const [paginatedRoles, setPaginatedRoles] = useState<{
        currentPage: number;
        data: Role[];
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: [],
        total: 0,
        totalPage: 0,
    });

    const debouncedSearch = useCallback(
        debounce(async (searchTerm) => {
            const response = await dispatch(userGetPaginatedThunk({ search: searchTerm, page: 1, limit: 10 }));
            setPaginatedData({
                data: response.data,
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            });
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        handleNextPage();
    }, []);

    useEffect(() => {
        if (search !== null) debouncedSearch(search);
    }, [search, debouncedSearch]);

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

    const handleNextPage = async () => {
        setLoadingCreators(true);
        const response = await dispatch(userGetPaginatedThunk({ page: paginatedData.currentPage + 1, limit: 10 }));
        if (response.data.length) {
            setPaginatedData((prev) => ({
                data: [...prev.data, ...response.data],
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            }));
        }
        setLoadingCreators(false);
        setLoadingRoles(true);
        const responseRoles = await dispatch(
            roleGetPaginatedThunk({ page: paginatedRoles.currentPage + 1, limit: 10 })
        );
        if (responseRoles.data.length) {
            setPaginatedRoles((prev) => ({
                data: [...prev.data, ...responseRoles.data],
                currentPage: responseRoles.page,
                total: responseRoles.total,
                totalPage: responseRoles.totalPage,
            }));
        }
        setLoadingRoles(false);
    };

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
                        data={paginatedData.data}
                        onDeleteClick={onDeleteClick}
                        onUserClick={({ id }) => setUserId(id)}
                        loading={loadingCreators || loadingRoles}
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
                        roles={paginatedRoles.data}
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
