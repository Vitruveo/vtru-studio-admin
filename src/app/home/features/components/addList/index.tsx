import React from 'react';
import { useFormik } from 'formik';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useDispatch } from '@/store/hooks';
import { allowListActionsCreators } from '@/features/allowList/slice';

interface Props {
    handleAddNewFeature(params: { name: string }): void;
}

export default function AddList({ handleAddNewFeature }: Props) {
    const dispatch = useDispatch();

    const [modal, setModal] = React.useState(false);

    const { handleSubmit, handleChange, resetForm, setFieldValue, values, errors } = useFormik({
        initialValues: {
            name: '',
            emails: [],
        },
        onSubmit: async (payload) => {
            handleAddNewFeature({
                name: payload.name,
            });
            toggle();
            resetForm();
        },
    });

    const toggle = () => {
        dispatch(allowListActionsCreators.changeGetData());
        setModal(!modal);
    };

    return (
        <>
            <Box p={3} pb={1}>
                <Button color="primary" variant="contained" fullWidth onClick={toggle}>
                    Add Feature
                </Button>
            </Box>
            <Dialog
                open={modal}
                onClose={toggle}
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" variant="h5">
                    Add Feature
                </DialogTitle>
                <DialogContent>
                    <Box width={500} mt={1}>
                        <form onSubmit={handleSubmit}>
                            <Grid container>
                                <Grid item xs={12} lg={9}>
                                    <FormLabel>Name</FormLabel>
                                    <Box>
                                        <TextField
                                            id="name"
                                            placeholder="Enter feature name"
                                            name="name"
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            value={values.name}
                                            onChange={handleChange}
                                        />
                                        {errors?.name && <span>{errors.name}</span>}
                                    </Box>
                                </Grid>

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
