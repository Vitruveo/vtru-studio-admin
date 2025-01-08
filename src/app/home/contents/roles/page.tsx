'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import RoleDetails from '@/app/home/components/apps/roles/RoleDetails';
import RoleList from '@/app/home/components/apps/roles/RoleList';
import RoleSearch from '@/app/home/components/apps/roles/RoleSearch';
import RoleFilter from '@/app/home/components/apps/roles/RoleFilter';
import AppCard from '@/app/home/components/shared/AppCard';
import { useDispatch } from '@/store/hooks';
import { roleDeleteThunk, roleGetPaginatedThunk } from '@/features/role/thunks';
import RoleAdd from '../../components/apps/roles/RoleAdd';
import { RoleDialogDelete } from '../../components/apps/roles/RoleDialogDelete';
import { RoleType } from '@/mock/roles';
import { debounce } from '@mui/material/utils';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Roles() {
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useDispatch();

    const [roleId, setRoleId] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [roleDelete, setRoleDelete] = useState({ name: '', id: '' });
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: RoleType[];
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
            const response = await dispatch(roleGetPaginatedThunk({ search: searchTerm, page: 1, limit: 10 }));
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
        if (!roleId && paginatedData.data.length >= 1) {
            setRoleId(paginatedData.data[0]._id);
        }
    }, [paginatedData.data]);

    useEffect(() => {
        if (search !== null) debouncedSearch(search);
    }, [search, debouncedSearch]);

    const categories = useMemo(() => {
        return paginatedData.data
            .reduce((acc: string[], role) => {
                role.permissions.forEach((permission) => {
                    const [categoryName] = permission.split(':');

                    if (!acc.includes(categoryName)) {
                        acc.push(categoryName);
                    }
                });

                return acc;
            }, [])
            .sort();
    }, [paginatedData.data]);

    const onDeleteClick = ({ id, name }: { id: string; name: string }) => {
        setIsOpenDialogDelete(true);
        setRoleDelete({ id, name: name });
    };

    const onDeleteConfirm = () => {
        const { id } = roleDelete;

        dispatch(roleDeleteThunk({ _id: id }));

        if (id === roleId) setRoleId('');
        setIsOpenDialogDelete(false);
    };

    const handleNextPage = async () => {
        const response = await dispatch(roleGetPaginatedThunk({ page: paginatedData.currentPage + 1, limit: 10 }));
        if (response.data.length) {
            setPaginatedData((prev) => ({
                data: [...prev.data, ...response.data],
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            }));
        }
    };

    return (
        <PageContainer title="Role" description="this is Role">
            <Breadcrumb title="Roles Application" subtitle="List Your Roles" />
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
                    <RoleAdd />
                    <RoleFilter categories={categories} category={category} setCategory={setCategory} />
                </Drawer>

                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: {
                            xs: '100%',
                            md: secdrawerWidth,
                            lg: secdrawerWidth,
                        },
                        flexShrink: 0,
                    }}
                >
                    <RoleSearch onClick={() => setLeftSidebarOpen(true)} search={search} setSearch={setSearch} />
                    <RoleList
                        roleId={roleId}
                        data={paginatedData.data}
                        onDeleteClick={onDeleteClick}
                        onRoleClick={({ id }) => setRoleId(id)}
                        nextPage={handleNextPage}
                        hasMore={paginatedData.currentPage < paginatedData.totalPage}
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
                        [`& .MuiDrawer-paper`]: {
                            width: '100%',
                            position: 'relative',
                        },
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
                                sx={{
                                    mb: 3,
                                    display: {
                                        xs: 'block',
                                        md: 'none',
                                        lg: 'none',
                                    },
                                }}
                            >
                                Back{' '}
                            </Button>
                        </Box>
                    )}
                    <RoleDetails roleId={roleId} onDeleteClick={onDeleteClick} />
                </Drawer>
            </AppCard>

            <RoleDialogDelete
                roleName={roleDelete.name}
                isOpen={isOpenDialogDelete}
                handleCancel={() => setIsOpenDialogDelete(!isOpenDialogDelete)}
                handleConfirm={onDeleteConfirm}
            />
        </PageContainer>
    );
}
