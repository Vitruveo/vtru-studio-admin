'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from '@/app/home/components/container/PageContainer';
import Breadcrumb from '@/app/home/layout/shared/breadcrumb/Breadcrumb';
import CreatorDetails from '@/app/home/components/apps/creators/CreatorDetails';
import CreatorList from '@/app/home/components/apps/creators/CreatorList';
import CreatorSearch from '@/app/home/components/apps/creators/CreatorSearch';
import CreatorFilter from '@/app/home/components/apps/creators/CreatorFilter';
import AppCard from '@/app/home/components/shared/AppCard';
import { CreatorType } from '@/mock/creators';
import { CreatorDialogDelete } from '../../components/apps/creators/CreatorDialogDelete';
import { useDispatch } from '@/store/hooks';
import { subscribeWebSocketThunk, unsubscribeWebSocketThunk, websocketSelector } from '@/features/ws';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Creators() {
  const dispatch = useDispatch();

  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const { creatorsOnline } = useSelector(websocketSelector(['creatorsOnline']));

  const [creators, setCreators] = useState<{ [key: string]: CreatorType }>({});
  const [search, setSearch] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [isCreatorsOnline, setIsCreatorsOnline] = useState(false);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [creatorDelete, setCreatorDelete] = useState({ email: '', id: '' });

  useEffect(() => {
    dispatch(subscribeWebSocketThunk());

    return () => {
      dispatch(unsubscribeWebSocketThunk());
    };
  }, []);

  useEffect(() => {
    const diff: { [key: string]: CreatorType } = {};
    creatorsOnline.forEach((item) => {
      diff[item._id] = {
        _id: item._id,
        login: { email: item.email },
      } as CreatorType;
    });

    setCreators((prevState) => ({ ...diff, ...prevState }));
  }, [creatorsOnline]);

  useEffect(() => {
    const sseCreators = new EventSource('http://127.0.0.1:5001/creators');

    sseCreators.addEventListener('creator_list', (event) => {
      const creator = JSON.parse(event.data);

      setCreators((prevState) => ({ ...prevState, [creator._id]: creator }));
    });
    sseCreators.addEventListener('close', (event) => {
      sseCreators.close();
    });

    return () => {
      sseCreators.close();
    };
  }, []);

  const creatorsFiltered = useMemo(() => {
    return search.length > 0
      ? Object.values(creators).filter(
          (creator) => creator.name.includes(search) || creator.login.email.includes(search),
        )
      : [];
  }, [search, creators]);

  const creatorsOnlineFiltered = useMemo(() => {
    return isCreatorsOnline
      ? Object.values(creators).filter((creator) => creatorsOnline.some((item) => creator._id === item._id))
      : [];
  }, [isCreatorsOnline]);

  const onDeleteClick = ({ id, email }: { id: string; email: string }) => {
    setIsOpenDialogDelete(true);
    setCreatorDelete({ id, email });
  };

  const onDeleteConfirm = () => {
    const { id } = creatorDelete;

    // dispatch(creatorDeleteThunk({ _id: id }));
    setCreators((prevState) => {
      delete prevState[id];

      return prevState;
    });
    if (id === creatorId) setCreatorId('');

    setIsOpenDialogDelete(false);
  };

  return (
    <PageContainer title="Creator" description="this is Creators">
      <Breadcrumb title="Creators Application" subtitle="List Your Creators" />
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
          <CreatorFilter handleToggleOnline={() => setIsCreatorsOnline(!isCreatorsOnline)} />
        </Drawer>

        <Box
          sx={{
            minWidth: secdrawerWidth,
            width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
            flexShrink: 0,
          }}>
          <CreatorSearch onClick={() => setLeftSidebarOpen(true)} search={search} setSearch={setSearch} />
          <CreatorList
            creatorId={creatorId}
            data={
              (search.length > 0 && creatorsFiltered) ||
              (isCreatorsOnline && creatorsOnlineFiltered) ||
              Object.values(creators)
            }
            onDeleteClick={onDeleteClick}
            onCreatorClick={({ id }) => setCreatorId(id)}
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
                sx={{ mb: 3, display: { xs: 'block', md: 'none', lg: 'none' } }}>
                Back{' '}
              </Button>
            </Box>
          )}
          <CreatorDetails creatorId={creatorId} onDeleteClick={onDeleteClick} />
        </Drawer>
      </AppCard>

      <CreatorDialogDelete
        creatorName={creatorDelete.email}
        isOpen={isOpenDialogDelete}
        handleCancel={() => setIsOpenDialogDelete(!isOpenDialogDelete)}
        handleConfirm={onDeleteConfirm}
      />
    </PageContainer>
  );
}
