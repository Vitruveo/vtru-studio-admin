'use client';

import React, { useMemo, useState } from 'react';
import { Drawer, useMediaQuery, Theme, Box, Button } from '@mui/material';
import * as Yup from 'yup';
import PageContainer from '../components/container/PageContainer';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import AppCard from '../components/shared/AppCard';
import AddList from './components/addList';
import List from './components/list';
import Search from './components/search';
import Details from './components/details';
import { addMultipleAllowList, deletAllowList, updateAllowList } from '@/features/allowList/requests';
import { AllowItem } from '@/features/allowList/types';
import { useToastr } from '@/app/hooks/use-toastr';
import { useSelector } from '@/store/hooks';

const drawerWidth = 240;
const secdrawerWidth = 320;

const emailSchema = Yup.string().email().required();

export default function AllowList() {
    const toastr = useToastr();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [activeEmail, setActiveEmail] = useState<AllowItem>();
    const [search, setSearch] = useState('');

    const emails = useSelector((state) => state.allowList.allIds.map((id) => state.allowList.byId[id]));

    const handleAddNewEmails = async (params: { emails: string[] }) => {
        const emailPromises = params.emails.map(async (email, index, self) => {
            try {
                await emailSchema.validate(email);
                return (
                    email.length &&
                    !emails.some((item) => item.email === email) &&
                    index === self.findIndex((e) => e === email)
                );
            } catch (error) {
                return false;
            }
        });

        const emailResults = await Promise.all(emailPromises);

        const validEmails = params.emails.filter((email, index) => emailResults[index]);

        if (validEmails.length) {
            await addMultipleAllowList(validEmails.map((email) => ({ email })));
        } else {
            toastr.display({
                type: 'info',
                message: 'emails/email already belong to the allowlist',
            });
        }
    };

    const onDeleteClick = async (params: AllowItem) => {
        const newEmails = emails.filter((item) => item.email !== params.email);
        if (activeEmail?.email === params.email) {
            setActiveEmail(newEmails[0]);
        }
        await deletAllowList(params._id);
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

    const emailsFiltered = useMemo(() => {
        return search.length > 0 ? emails.filter((v) => v.email.toLowerCase().includes(search.toLowerCase())) : [];
    }, [search, emails]);

    return (
        <PageContainer title="Allow List">
            <Breadcrumb title="Allow List" />

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
                        activeEmail={activeEmail}
                        emails={search.length > 0 ? emailsFiltered : emails}
                        onDeleteClick={onDeleteClick}
                        onEmailClick={(allowItem) => setActiveEmail(allowItem)}
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
                        setActiveEmail={setActiveEmail}
                        activeEmail={activeEmail}
                        handleUpdateEmail={handleUpdateEmail}
                    />
                </Drawer>
            </AppCard>
        </PageContainer>
    );
}
