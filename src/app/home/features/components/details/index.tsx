import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import { useDispatch } from '@/store/hooks';
import { Button, Switch } from '@mui/material';
import BlankCard from '@/app/home/components/shared/BlankCard';
import Scrollbar from '@/app/home/components/custom-scroll/Scrollbar';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/home/components/forms/theme-elements/CustomTextField';
import { FeatureItem } from '@/features/features/types';

interface Props {
    activeFeature?: FeatureItem;
    setActiveFeature(params?: FeatureItem): void;
    handleUpdateFeature(params: { name: string }): void;
}

export default function Details({ activeFeature, setActiveFeature, handleUpdateFeature }: Props) {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [starred, setStarred] = useState(false);

    const { values, errors, setFieldValue, handleSubmit, handleChange } = useFormik<{
        name: string;
        released: boolean;
        onlyForAllowList: boolean;
    }>({
        initialValues: {
            name: '',
            released: false,
            onlyForAllowList: false,
        },
        onSubmit: async (payload) => {
            console.log({ payload });
            await handleUpdateFeature({ ...activeFeature, ...payload });
            setIsEditing(false);
        },
    });

    useEffect(() => {
        setFieldValue('name', activeFeature?.name);
        setFieldValue('released', activeFeature?.released);
        setFieldValue('onlyForAllowList', activeFeature?.onlyForAllowList);
    }, [activeFeature]);

    const handleChangeReleased = () => {
        setFieldValue('released', !values.released);
    };

    const handleChangeOnlyForAllowList = () => {
        setFieldValue('onlyForAllowList', !values.onlyForAllowList);
    };

    return (
        <>
            {activeFeature ? (
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
                                                    Editing feature
                                                </Typography>
                                                <Box>
                                                    <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                                                    <CustomTextField
                                                        type="name"
                                                        name="name"
                                                        id="name"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={values.name}
                                                        onChange={handleChange}
                                                    />
                                                    {errors?.name && <span>{errors.name}</span>}
                                                </Box>

                                                <Box marginTop={1} alignItems="center" gap={1}>
                                                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                                                        Released
                                                    </Typography>
                                                    <Box>
                                                        <Switch
                                                            checked={values.released}
                                                            onChange={handleChangeReleased}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box marginTop={1} alignItems="center" gap={1}>
                                                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                                                        Only For AllowList
                                                    </Typography>
                                                    <Box>
                                                        <Switch
                                                            checked={values.onlyForAllowList}
                                                            onChange={handleChangeOnlyForAllowList}
                                                        />
                                                    </Box>
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
                                                        onClick={() => setActiveFeature(undefined)}
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
                        <Typography variant="h4">Please Select a Feature</Typography>
                        <br />
                    </Box>
                </Box>
            )}
        </>
    );
}
