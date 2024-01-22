'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    findWaitingList,
    deletWaitingList,
    updateWaitingList,
} from '@/features/waitingList/requests';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';
import { WaitingItem } from '@/features/waitingList/types';
import { AllowItem } from '@/features/allowList/types';
import { addAllowList, findAllowList } from '@/features/allowList/requests';

const drawerWidth = 240;
const secdrawerWidth = 320;

const emailSchema = Yup.string().email().required();

export default function WaitingList() {
    const [toastr, setToastr] = useState<CustomizedSnackbarState>({
        type: 'success',
        open: false,
        message: '',
    });
    const [emails, setEmails] = useState<WaitingItem[]>([]);
    const [allowList, setAllowList] = useState<AllowItem[]>([]);
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [activeEmail, setActiveEmail] = useState<WaitingItem>();
    const [search, setSearch] = useState('');

    const handleGetWaitingList = async () => {
        const result = await findWaitingList();
        if (result.data) {
            const uniqueEmails = result.data.sort((a: WaitingItem, b: WaitingItem) => {
                if (new Date(a.framework.createdAt).getTime() > new Date(b.framework.createdAt).getTime()) {
                    return -1;
                }
                if (new Date(a.framework.createdAt).getTime() < new Date(b.framework.createdAt).getTime()) {
                    return 1;
                }
                return 0;
            });
            setEmails(uniqueEmails);
        }
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
                    !emails.some((item) => item.email === email) &&
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
            await handleGetWaitingList();
            if (validAllowList.length) {
                setToastr({
                    type: 'info',
                    open: true,
                    message: 'Only the emails not on the allow list have been added.',
                });
            }
        } else {
            setToastr({
                type: 'info',
                open: true,
                message: `emails/email already belong to the ${validAllowList.length ? 'allow list' : 'waiting list'}`,
            });
        }
    };

    const onDeleteClick = async (params: WaitingItem) => {
        const newEmails = emails.filter((item) => item.email !== params.email);
        if (activeEmail?.email === params.email) {
            setActiveEmail(newEmails[0]);
        }
        await deletWaitingList(params._id);
        await handleGetWaitingList();
    };

    const onAddAllowList = async (params: WaitingItem) => {
        await addAllowList(params);
        await onDeleteClick(params);
    };

    const handleUpdateEmail = async (params: WaitingItem) => {
        if (
            !emails.some((item) => item.email.trim() === params.email.trim()) &&
            !allowList.some((e) => e.email === params.email)
        ) {
            setActiveEmail(undefined);
            await updateWaitingList(params);
            await handleGetWaitingList();
        } else {
            setToastr({
                type: 'info',
                open: true,
                message: 'This email already exists in the Allow or Waiting list',
            });
        }
    };

    const emailsFiltered = useMemo(() => {
        return search.length > 0 ? emails.filter((v) => v.email.toLowerCase().includes(search.toLowerCase())) : [];
    }, [search, emails]);

    useEffect(() => {
        handleGetWaitingList();
        handleGetAllowList();
    }, []);

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
                        emails={search.length > 0 ? emailsFiltered : emails}
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
            <CustomizedSnackbar
                type={toastr.type}
                open={toastr.open}
                message={toastr.message}
                setOpentate={setToastr}
            />
        </PageContainer>
    );
}
