import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';

import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import { useDispatch } from '@/store/hooks';
import { Button, FormControlLabel, IconButton, Radio, RadioGroup, Switch } from '@mui/material';
import BlankCard from '@/app/home/components/shared/BlankCard';
import Scrollbar from '@/app/home/components/custom-scroll/Scrollbar';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/home/components/forms/theme-elements/CustomTextField';
import { FeatureItem } from '@/features/features/types';
import AddCreators from '../../../components/addCreators';
import { useCreators } from '@/app/hooks/useCreators';
import { IconTrash } from '@tabler/icons-react';

interface Props {
    activeFeature?: FeatureItem;
    setActiveFeature(params?: FeatureItem): void;
    handleUpdateFeature(params: { name: string }): void;
}

export default function Details({ activeFeature, setActiveFeature, handleUpdateFeature }: Props) {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [starred, setStarred] = useState(false);

    const { paginatedData } = useCreators();
    const { values, errors, setFieldValue, handleSubmit, handleChange } = useFormik<{
        name: string;
        released: boolean;
        isOnlyFor: boolean;
        onlyFor: string;
        emails: string[];
    }>({
        initialValues: {
            name: '',
            released: false,
            isOnlyFor: false,
            onlyFor: 'allowList',
            emails: [],
        },
        onSubmit: async (payload) => {
            await handleUpdateFeature({ ...activeFeature, ...payload });
            setIsEditing(false);
        },
    });

    useEffect(() => {
        setFieldValue('name', activeFeature?.name);
        setFieldValue('released', activeFeature?.released);
        setFieldValue('isOnlyFor', activeFeature?.isOnlyFor);
        setFieldValue('onlyFor', activeFeature?.onlyFor);
        setFieldValue('emails', activeFeature?.emails);
    }, [activeFeature]);

    const handleChangeReleased = () => {
        setFieldValue('released', !values.released);
    };

    const handleChangeIsOnlyFor = () => {
        setFieldValue('isOnlyFor', !values.isOnlyFor);
    };

    const handleChangeOnlyFor = (onlyFor: string) => {
        setFieldValue('onlyFor', onlyFor);
    };

    const handleAddNewEmails = useCallback(async (params: { emails: string[] }) => {
        if (params.emails.length) {
            setFieldValue('emails', [...values.emails, ...params.emails]);
        }
    }, []);

    const handleOnDeleteEmailClick = (emailFilter: string) => {
        const newEmails = values.emails.filter((email) => email !== emailFilter);
        setFieldValue('emails', [...newEmails]);
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
                                            lg: 'calc(100vh - 300px)',
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
                                                        Only For
                                                    </Typography>
                                                    <Box>
                                                        <Switch
                                                            checked={values.isOnlyFor}
                                                            onChange={handleChangeIsOnlyFor}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box marginTop={1}>
                                                    {values.isOnlyFor && (
                                                        <RadioGroup
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            defaultValue={values.onlyFor}
                                                            name="radio-buttons-group"
                                                            onChange={(e) => handleChangeOnlyFor(e.target.value)}
                                                        >
                                                            <FormControlLabel
                                                                value="allowList"
                                                                control={<Radio />}
                                                                label="AllowList"
                                                            />
                                                            <FormControlLabel
                                                                value="specificUsers"
                                                                control={<Radio />}
                                                                label="Specific Users"
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                </Box>

                                                {values.isOnlyFor && values.onlyFor === 'specificUsers' && (
                                                    <>
                                                        <Box marginTop={1} overflow="auto" maxHeight={100}>
                                                            {values?.emails.sort().map((email) => (
                                                                <Box
                                                                    display="flex"
                                                                    justifyContent="space-between"
                                                                    key={email}
                                                                >
                                                                    <Box width={200}>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            noWrap
                                                                            fontWeight={600}
                                                                            sx={{ maxWidth: '200px' }}
                                                                        >
                                                                            {email}
                                                                        </Typography>
                                                                    </Box>
                                                                    <IconButton
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            handleOnDeleteEmailClick(email);
                                                                        }}
                                                                    >
                                                                        <IconTrash size="16" stroke={1.5} />
                                                                    </IconButton>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                        <Box marginTop={1} width={125}>
                                                            <AddCreators
                                                                buttonSize="small"
                                                                showAddCreators={values.onlyFor === 'specificUsers'}
                                                                noMarginButton
                                                                creators={Object.values(paginatedData?.data)}
                                                                addedEmails={values.emails}
                                                                handleAddNewEmails={handleAddNewEmails}
                                                            />
                                                        </Box>
                                                    </>
                                                )}

                                                <Box
                                                    width="100%"
                                                    marginTop={1}
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
