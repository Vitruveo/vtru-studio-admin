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
import { RoleType } from '@/mock/roles';
import { PermissionType } from '@/mock/permissions';
import { useDispatch } from '@/store/hooks';
import { roleDeleteThunk } from '@/features/role/thunks';
import RoleAdd from '../../components/apps/roles/RoleAdd';
import { RoleDialogDelete } from '../../components/apps/roles/RoleDialogDelete';
import { list } from '@/services/apiEventSource';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Roles() {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const dispatch = useDispatch();

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [roleId, setRoleId] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [roleDelete, setRoleDelete] = useState({ name: '', id: '' });
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    if (!roleId && roles.length >= 1) {
      setRoleId(roles[0]._id);
    }
  }, [roles]);

  useEffect(() => {
    const fetchData = async () => {
      await list<RoleType>({
        path: 'roles',
        callback: (role) => setRoles((prevState) => [...prevState, role]),
      });

      await list<PermissionType>({
        path: 'permissions',
        callback: (permission) => setPermissions((prevState) => [...prevState, permission]),
      });
    };

    fetchData();
  }, []);

  const rolesFiltered = useMemo(() => {
    return search.length > 0
      ? roles.filter((role) => role.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      : [];
  }, [search, roles]);

  const rolesCategoryFiltered = useMemo(() => {
    return category.length > 0
      ? roles.filter((role) => {
          return role.permissions.some((permission) => {
            const [categoryName] = permission.split(':');

            return category.toLocaleLowerCase() === categoryName.toLocaleLowerCase();
          });
        })
      : [];
  }, [category, roles]);

  const categories = useMemo(() => {
    return permissions.reduce((acc: string[], cur) => {
      const [categoryName] = cur.key.split(':');
      if (acc.includes(categoryName)) return acc;

      return [...acc, categoryName];
    }, []);
  }, [permissions]);

  const onDeleteClick = ({ id, name }: { id: string; name: string }) => {
    setIsOpenDialogDelete(true);
    setRoleDelete({ id, name: name });
  };

  const onDeleteConfirm = () => {
    const { id } = roleDelete;

    dispatch(roleDeleteThunk({ _id: id }));
    setRoles((prevState) => prevState.filter((item) => item._id !== id));
    if (id === roleId) setRoleId('');

    setIsOpenDialogDelete(false);
  };

  const handleAddNewRole = useCallback(
    ({ id, name, description }: { id: string; name: string; description: string }) => {
      setRoles((prevState) => [
        {
          _id: id,
          name,
          description,
          permissions: [],
        },
        ...prevState,
      ]);

      setRoleId(id);
    },
    [],
  );

  const handleUpdateRole = useCallback(
    ({
      id,
      name,
      description,
      permissions: permissionsKeys,
    }: {
      id: string;
      name: string;
      description: string;
      permissions: string[];
    }) => {
      setRoles((prevState) =>
        prevState.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              name,
              description,
              permissions: permissionsKeys,
            };
          }

          return item;
        }),
      );
    },
    [],
  );

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
          variant={lgUp ? 'permanent' : 'temporary'}>
          <RoleAdd handleAddNewRole={handleAddNewRole} />
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
          }}>
          <RoleSearch onClick={() => setLeftSidebarOpen(true)} search={search} setSearch={setSearch} />
          <RoleList
            roleId={roleId}
            data={(search.length > 0 && rolesFiltered) || (category.length > 0 && rolesCategoryFiltered) || roles}
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
          }}>
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
                }}>
                Back{' '}
              </Button>
            </Box>
          )}
          <RoleDetails
            roleId={roleId}
            permissions={permissions}
            onDeleteClick={onDeleteClick}
            handleUpdateRole={handleUpdateRole}
          />
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
