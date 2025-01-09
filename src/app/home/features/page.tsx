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

import { useToastr } from '@/app/hooks/use-toastr';
import { useSelector } from '@/store/hooks';
import { addFeature, deleteFeature, findFeatures, updateFeature } from '@/features/features/requests';
import { FeatureItem } from '@/features/features/types';

const drawerWidth = 240;
const secdrawerWidth = 320;

export default function Features() {
    const toastr = useToastr();

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [features, setFeatures] = useState<FeatureItem[]>([]);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState<FeatureItem>();
    const [search, setSearch] = useState('');

    const getData = useSelector((state) => state.allowList.getData);

    const handleAddNewFeature = useCallback(async (params: { name: string }) => {
        if (
            features.some(
                (v) =>
                    v.name.trim().toLowerCase().replace(/\s/g, '') !==
                    params.name.trim().toLowerCase().replace(/\s/g, '')
            )
        )
            await addFeature(params);
        else {
            toastr.display({
                type: 'info',
                message: 'name already exists',
            });
        }
    }, []);

    const onDeleteClick = async (params: FeatureItem) => {
        const newEmails = features.filter((item) => item.name !== params.name);
        if (activeFeature?.name === params.name) {
            setActiveFeature(newEmails[0]);
        }
        await deleteFeature(params._id);
        setFeatures((prev) => prev.filter((v) => v._id !== params._id));
    };

    const handleUpdateFeature = async (params: FeatureItem) => {
        if (!features.some((item) => item.name.trim() === params.name.trim() && params._id !== item._id)) {
            setActiveFeature(undefined);
            await updateFeature(params);
            setFeatures((prev) => prev.map((v) => (v._id === params._id ? params : v)));
        }
    };

    const toggleLeftSidebar = useCallback(() => {
        setLeftSidebarOpen((prev) => !prev);
    }, []);

    const featuresFiltered = useMemo(() => {
        return search.length > 0 ? features.filter((v) => v.name.toLowerCase().includes(search.toLowerCase())) : [];
    }, [search, features]);

    useEffect(() => {
        (async () => {
            const res = await findFeatures();
            if (res.data?.length) {
                setFeatures(res.data);
            }
        })();
    }, [getData]);

    return (
        <PageContainer title="Features">
            <Breadcrumb title="Features" />

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
                    <AddList handleAddNewFeature={handleAddNewFeature} />
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
                        activeFeature={activeFeature}
                        features={search.length > 0 ? featuresFiltered : features}
                        onDeleteClick={onDeleteClick}
                        onFeatureClick={(featureItem) => setActiveFeature(featureItem)}
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
                        setActiveFeature={setActiveFeature}
                        activeFeature={activeFeature}
                        handleUpdateFeature={handleUpdateFeature}
                    />
                </Drawer>
            </AppCard>
        </PageContainer>
    );
}
