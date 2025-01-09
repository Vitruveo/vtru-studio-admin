import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import Image from 'next/image';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import emailIcon from 'public/images/breadcrumb/emailSv.png';

import { useDispatch } from '@/store/hooks';

import BlankCard from '@/app/home/components/shared/BlankCard';
import Scrollbar from '@/app/home/components/custom-scroll/Scrollbar';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';

import { AllowItem } from '@/features/allowList/types';
import { CreatorType } from '@/features/creator';

interface Props {
    creators: CreatorType[];
    activeEmail?: AllowItem;
    setActiveEmail(params?: AllowItem): void;
    handleUpdateEmail(params: { email: string }): void;
}

export default function Details({ creators, activeEmail, setActiveEmail, handleUpdateEmail }: Props) {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [starred, setStarred] = useState(false);

    const { values, errors, setFieldValue, handleSubmit, handleChange } = useFormik<{ email: string }>({
        initialValues: {
            email: '',
        },
        onSubmit: async (payload) => {
            await handleUpdateEmail({ ...activeEmail, ...payload });
            setIsEditing(false);
        },
    });

    const creator = creators.find((creatorItem) => creatorItem.emails.some((v) => v.email === activeEmail?.email));

    useEffect(() => {
        setFieldValue('email', activeEmail?.email);
    }, [activeEmail]);

    return (
        <>
            {activeEmail ? (
                <>
                    <Box sx={{ overflow: 'auto' }}>
                        <>
                            <BlankCard sx={{ p: 0 }}>
                                <Scrollbar
                                    sx={{
                                        height: {
                                            lg: 'calc(100vh - 360px)',
                                            md: '100vh',
                                        },
                                    }}
                                >
                                    <Box pt={1}>
                                        <form onSubmit={handleSubmit}>
                                            <Box width={350} p={3}>
                                                <Typography variant="h6" mb={0.5}>
                                                    Creator
                                                </Typography>
                                                <Box>
                                                    <CustomFormLabel htmlFor="name">Username</CustomFormLabel>
                                                    <Box>{creator?.username || 'N/A'}</Box>
                                                </Box>
                                                <Box>
                                                    <CustomFormLabel htmlFor="name">Vault Address</CustomFormLabel>
                                                    <Box>{creator?.vault.vaultAddress || 'N/A'}</Box>
                                                </Box>
                                            </Box>
                                        </form>
                                    </Box>
                                </Scrollbar>
                            </BlankCard>
                        </>
                    </Box>
                </>
            ) : (
                <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
                    <Box>
                        <Typography variant="h4">Please Select a Email</Typography>
                        <br />
                        <Image src={emailIcon} alt={'emailIcon'} width="250" />
                    </Box>
                </Box>
            )}
        </>
    );
}
