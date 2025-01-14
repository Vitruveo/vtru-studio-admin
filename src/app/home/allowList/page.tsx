'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer, useMediaQuery, Theme, Box, Button } from '@mui/material';

import PageContainer from '../components/container/PageContainer';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import AppCard from '../components/shared/AppCard';
import AddList from './components/addList';
import List from './components/list';
import Search from './components/search';
import Details from './components/details';
import { addMultipleAllowList, deletAllowList, findAllowList, updateAllowList } from '@/features/allowList/requests';
import { AllowItem } from '@/features/allowList/types';
import { useToastr } from '@/app/hooks/use-toastr';
import { useSelector, useDispatch } from '@/store/hooks';

import { CreatorType } from '@/features/creator';
import { getCreatorsPaginatedThunk } from '@/features/creator/thunks';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function AllowList() {
    const dispatch = useDispatch();
    const toastr = useToastr();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [emails, setEmails] = useState<AllowItem[]>([]);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [activeEmail, setActiveEmail] = useState<AllowItem>();
    const [search, setSearch] = useState('');

    const getData = useSelector((state) => state.allowList.getData);

    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: { [key: string]: CreatorType };
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: {},
        total: 0,
        totalPage: 0,
    });

    const handleAddNewEmails = useCallback(async (params: { emails: string[] }) => {
        if (params.emails.length) {
            await addMultipleAllowList(params.emails.map((email) => ({ email })));
        } else {
            toastr.display({
                type: 'info',
                message: 'emails/email already belong to the allowlist',
            });
        }
    }, []);

    const onDeleteClick = async (params: AllowItem) => {
        const newEmails = emails.filter((item) => item.email !== params.email);
        if (activeEmail?.email === params.email) {
            setActiveEmail(newEmails[0]);
        }
        await deletAllowList(params._id);
        setEmails((prev) => prev.filter((v) => v._id !== params._id));
    };

    const handleUpdateEmail = async (params: AllowItem) => {
        if (!emails.some((item) => item.email.trim() === params.email.trim())) {
            setActiveEmail(undefined);
            await updateAllowList(params);
        } else {
            toastr.display({
                type: 'info',
                message: 'emails/email already belong to the allowlist',
            });
        }
    };

    const toggleLeftSidebar = useCallback(() => {
        setLeftSidebarOpen((prev) => !prev);
    }, []);

    const emailsFiltered = useMemo(() => {
        return search.length > 0 ? emails.filter((v) => v.email.toLowerCase().includes(search.toLowerCase())) : [];
    }, [search, emails]);

    useEffect(() => {
        (async () => {
            const res = await findAllowList();
            if (res.data?.length) {
                setEmails(res.data.sort((a, b) => (a.email < b.email ? -1 : a.email > b.email ? 1 : 0)));
            }
        })();
    }, [getData]);

    useEffect(() => {
        const fetchPaginatedData = async (page = 1, aggregatedData = {}) => {
            const response = await dispatch(getCreatorsPaginatedThunk({ page, limit: 100 }));

            const updatedData = {
                ...aggregatedData,
                ...response.data.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
            };

            setPaginatedData({
                data: updatedData,
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            });

            if (response.page < response.totalPage) {
                fetchPaginatedData(page + 1, updatedData);
            }
        };

        fetchPaginatedData();
    }, [dispatch]);

    return (
        <PageContainer title="Allow List">
            <Breadcrumb title="Allow List" />

            <AppCard>
                <Drawer
                    open={isLeftSidebarOpen}
                    onClose={toggleLeftSidebar}
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
                    <AddList
                        creators={Object.values(paginatedData.data)}
                        allowList={emails}
                        handleAddNewEmails={handleAddNewEmails}
                    />
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
                    <Search onClick={toggleLeftSidebar} search={search} setSearch={setSearch} />
                    <List
                        activeEmail={activeEmail}
                        emails={search.length > 0 ? emailsFiltered : emails}
                        onDeleteClick={onDeleteClick}
                        onEmailClick={(allowItem) => setActiveEmail(allowItem)}
                    />
                </Box>
                <Drawer
                    anchor="right"
                    open={isRightSidebarOpen}
                    onClose={toggleLeftSidebar}
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
                    <Details
                        creators={Object.values(paginatedData.data)}
                        setActiveEmail={setActiveEmail}
                        activeEmail={activeEmail}
                        handleUpdateEmail={handleUpdateEmail}
                    />
                </Drawer>
            </AppCard>
        </PageContainer>
    );
}
