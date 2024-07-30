'use client';

import { useEffect, useMemo, useState } from 'react';

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
import { roleDeleteThunk } from '@/features/role/thunks';
import RoleAdd from '../../components/apps/roles/RoleAdd';
import { RoleDialogDelete } from '../../components/apps/roles/RoleDialogDelete';
import { useLiveStream } from '../../components/liveStream';
import { RoleType } from '@/mock/roles';
import { CREATED_ROLE, DELETED_ROLE, EVENTS_ROLES, LIST_ROLES, UPDATED_ROLE } from '../../components/liveStream/events';

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

    const { chunk: roles, loading: loadingRoles } = useLiveStream<RoleType>({
        event: {
            list: LIST_ROLES,
            update: UPDATED_ROLE,
            delete: DELETED_ROLE,
            create: CREATED_ROLE,
        },
        listemEvents: EVENTS_ROLES,
    });

    useEffect(() => {
        if (!roleId && roles.length >= 1) {
            setRoleId(roles[0]._id);
        }
    }, [roles]);

    const rolesFiltered = useMemo(() => {
        return search.length > 0 ? roles.filter((role) => role.name.toLowerCase().includes(search.toLowerCase())) : [];
    }, [search, roles]);

    const rolesCategoryFiltered = useMemo(() => {
        return category.length > 0
            ? roles.filter((role) => {
                  return role.permissions.some((permission) => {
                      const [categoryName] = permission.split(':');

                      return category.toLowerCase() === categoryName.toLowerCase();
                  });
              })
            : [];
    }, [category, roles]);

    const categories = useMemo(() => {
        return roles
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
    }, [roles]);

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
                        data={
                            (search.length > 0 && rolesFiltered) ||
                            (category.length > 0 && rolesCategoryFiltered) ||
                            roles
                        }
                        onDeleteClick={onDeleteClick}
                        onRoleClick={({ id }) => setRoleId(id)}
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
