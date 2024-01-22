import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import Image from 'next/image';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconPencil, IconStar, IconTrash } from '@tabler/icons-react';

import emailIcon from 'public/images/breadcrumb/emailSv.png';

import { useDispatch } from '@/store/hooks';
import { Button } from '@mui/material';
import BlankCard from '@/app/home/components/shared/BlankCard';
import Scrollbar from '@/app/home/components/custom-scroll/Scrollbar';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/home/components/forms/theme-elements/CustomTextField';
import { AllowItem } from '@/features/allowList/types';

interface Props {
    activeEmail?: AllowItem;
    setActiveEmail(params?: AllowItem): void;
    handleUpdateEmail(params: { email: string }): void;
}

export default function Details({ activeEmail, setActiveEmail, handleUpdateEmail }: Props) {
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
                                                    Editing email
                                                </Typography>
                                                <Box>
                                                    <CustomFormLabel htmlFor="name">Email</CustomFormLabel>
                                                    <CustomTextField
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={values.email}
                                                        onChange={handleChange}
                                                    />
                                                    {errors?.email && <span>{errors.email}</span>}
                                                </Box>

                                                <Box
                                                    width="100%"
                                                    marginTop={5}
                                                    gap={1}
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                >
                                                    <Button
                                                        color="error"
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => setActiveEmail(undefined)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        size="small"
                                                        type="submit"
                                                    >
                                                        Save
                                                    </Button>
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
