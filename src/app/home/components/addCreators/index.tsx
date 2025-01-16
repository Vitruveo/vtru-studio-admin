import React from 'react';
import { useFormik } from 'formik';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import AsyncSearchSelect from './searchInput';

import { useDispatch } from '@/store/hooks';
import { allowListActionsCreators } from '@/features/allowList/slice';
import { CreatorType } from '@/features/creator';

interface Props {
    buttonSize?: 'small' | 'medium' | 'large';
    noMarginButton?: boolean;
    showAddCreators?: boolean;
    creators: CreatorType[];
    addedEmails: string[];
    handleAddNewEmails(params: { emails: string[] }): void;
}

export default function AddList({
    showAddCreators = true,
    noMarginButton,
    buttonSize,
    addedEmails,
    creators,
    handleAddNewEmails,
}: Props) {
    const dispatch = useDispatch();

    const [modal, setModal] = React.useState(false);

    const { handleSubmit, resetForm, setFieldValue, values } = useFormik({
        initialValues: {
            email: '',
            emails: [],
        },
        onSubmit: async (payload) => {
            const newEmails = values.email.length ? [values.email, ...values.emails] : values.emails;
            handleAddNewEmails({
                emails: newEmails,
            });
            toggle();
            resetForm();
        },
    });

    const toggle = () => {
        dispatch(allowListActionsCreators.changeGetData());
        setModal(!modal);
    };

    const handleEmailsChange = (emails: string[]) => {
        setFieldValue('emails', emails);
    };

    return (
        <>
            <Box p={noMarginButton ? 0 : 3} pb={1}>
                {showAddCreators && (
                    <Button
                        size={buttonSize || 'medium'}
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={toggle}
                    >
                        Add Creators
                    </Button>
                )}
            </Box>
            <Dialog
                open={modal}
                onClose={toggle}
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle marginInline={2} id="alert-dialog-title" variant="h5">
                    Add Creators
                </DialogTitle>
                <DialogContent>
                    <Box marginInline={2} maxHeight={500} width={500} mt={1}>
                        <form onSubmit={handleSubmit}>
                            <Grid container>
                                {/* <Grid item xs={12} lg={9}>
                                    <FormLabel>Email</FormLabel>
                                    <Box>
                                        <TextField
                                            id="email"
                                            placeholder="Enter email address"
                                            name="email"
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            value={values.email}
                                            onChange={handleEmailChange}
                                        />
                                        {errors?.email && <span>{errors.email}</span>}
                                    </Box>
                                </Grid> */}

                                <Box width="100%" display="flex" justifyContent="center">
                                    <AsyncSearchSelect
                                        creators={creators}
                                        addedEmails={addedEmails}
                                        handleEmailsChange={handleEmailsChange}
                                    />
                                </Box>
                                <Box
                                    width="100%"
                                    marginTop={1}
                                    paddingY={3}
                                    gap={1}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button variant="outlined" color="error" onClick={toggle}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="primary" type="submit">
                                        Save
                                    </Button>
                                </Box>
                            </Grid>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
