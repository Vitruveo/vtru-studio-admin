'use client';
import { Grid, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import PageContainer from '@/app/home/components/container/PageContainer';

import AuthLogin from './components/authLogin/container';
import Image from 'next/image';
import { useSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function Login() {
    const router = useRouter();
    const hasToken = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (hasToken) router.push('/home');
    }, []);

    return (
        <PageContainer title="Login Page" description="this is Sample page">
            <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={7}
                    xl={8}
                    sx={{
                        position: 'relative',
                        '&:before': {
                            content: '""',
                            background: '#F2ECF9',
                            backgroundSize: '400% 400%',
                            animation: 'gradient 15s ease infinite',
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            opacity: '0.3',
                        },
                    }}
                >
                    <Box position="relative">
                        <Box px={3}></Box>
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            height={'calc(100vh - 75px)'}
                            sx={{
                                display: {
                                    xs: 'none',
                                    lg: 'flex',
                                },
                            }}
                        >
                            <Image
                                src={'/images/logos/vtru-login-admin.svg'}
                                alt="bg"
                                width={500}
                                height={500}
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    maxHeight: '500px',
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} lg={5} xl={4} display="flex" justifyContent="center" alignItems="center">
                    <Box p={4}>
                        <AuthLogin />
                    </Box>
                </Grid>
            </Grid>
        </PageContainer>
    );
}
