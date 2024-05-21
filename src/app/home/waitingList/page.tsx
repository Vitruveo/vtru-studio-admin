'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, useMediaQuery, Theme, Box, Button } from '@mui/material';
import * as Yup from 'yup';
import PageContainer from '../components/container/PageContainer';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import AppCard from '../components/shared/AppCard';
import AddList from './components/addList';
import List from './components/list';
import Search from './components/search';
import Details from './components/details';
import {
    addMultipleWaitingList,
    deletWaitingList,
    updateWaitingList,
} from '@/features/waitingList/requests';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';
import { WaitingItem } from '@/features/waitingList/types';
import { AllowItem } from '@/features/allowList/types';
import { addAllowList, findAllowList } from '@/features/allowList/requests';
import { useDispatch, useSelector } from '@/store/hooks';
import { getWaitingListThunk } from '@/features/waitingList/thunks';
import { useToastr } from '@/app/hooks/use-toastr';

const drawerWidth = 240;
const secdrawerWidth = 320;

const emailSchema = Yup.string().email().required();

export default function WaitingList() {
    const dispatch = useDispatch();
    const waitingList = useSelector((state) => state.waitingList.all);
    const [allowList, setAllowList] = useState<AllowItem[]>([]);
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [activeEmail, setActiveEmail] = useState<WaitingItem>();
    const [search, setSearch] = useState('');
    const toastr = useToastr();

    useEffect(() => {
        handleGetAllowList();
        getWaitingList();
    }, []);

    const getWaitingList = () => {
        dispatch(getWaitingListThunk());
    };

    const handleGetAllowList = async () => {
        const result = await findAllowList();
        if (result.data) {
            setAllowList(result.data);
        }
    };

    const handleAddNewEmails = async (params: { emails: string[] }) => {
        const validAllowList = params.emails.filter((email) => allowList.some((e) => e.email === email));
        const emailPromises = params.emails.map(async (email, index, self) => {
            try {
                await emailSchema.validate(email);
                return (
                    email.length &&
                    !waitingList.some((item) => item.email === email) &&
                    !allowList.some((e) => e.email === email) &&
                    index === self.findIndex((e) => e === email)
                );
            } catch (error) {
                return false;
            }
        });

        const emailResults = await Promise.all(emailPromises);

        const validEmails = params.emails.filter((email, index) => emailResults[index]);

        if (validEmails.length) {
            await addMultipleWaitingList(validEmails.map((email) => ({ email })));
            getWaitingList();
            if (validAllowList.length) {
                toastr.display({
                    type: 'info',
                    message: 'Only the emails not on the allow list have been added.',
                });
            }
        } else {
            toastr.display({
                type: 'info',
                message: `emails/email already belong to the ${validAllowList.length ? 'allow list' : 'waiting list'}`,
            });
        }
    };

    const onDeleteClick = async (params: WaitingItem) => {
        const newEmails = waitingList.filter((item) => item.email !== params.email);
        if (activeEmail?.email === params.email) {
            setActiveEmail(newEmails[0]);
        }
        await deletWaitingList(params._id);
        getWaitingList();
    };

    const onAddAllowList = async (params: WaitingItem) => {
        await addAllowList(params);
        await onDeleteClick(params);
    };

    const handleUpdateEmail = async (params: WaitingItem) => {
        if (
            !waitingList.some((item) => item.email.trim() === params.email.trim()) &&
            !allowList.some((e) => e.email === params.email)
        ) {
            setActiveEmail(undefined);
            await updateWaitingList(params);
            getWaitingList();
        } else {
            toastr.display({
                type: 'info',
                message: 'This email already exists in the Allow or Waiting list',
            });
        }
    };

    const waitingListFiltered = useMemo(() => {
        return search.length > 0 ? waitingList.filter((v) => v.email.toLowerCase().includes(search.toLowerCase())) : [];
    }, [search, waitingList]);

    return (
        <PageContainer title="Waiting List">
            <Breadcrumb title="Waiting List" />

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
                    <AddList handleAddNewEmails={handleAddNewEmails} />
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
                    <Search onClick={() => setLeftSidebarOpen(true)} search={search} setSearch={setSearch} />
                    <List
                        onAddAllowList={onAddAllowList}
                        activeEmail={activeEmail}
                        emails={search.length > 0 ? waitingListFiltered : waitingList}
                        onDeleteClick={onDeleteClick}
                        onEmailClick={(waitingItem) => setActiveEmail(waitingItem)}
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
                    <Details
                        activeEmail={activeEmail}
                        setActiveEmail={setActiveEmail}
                        handleUpdateEmail={handleUpdateEmail}
                    />
                </Drawer>
            </AppCard>
        </PageContainer>
    );
}
