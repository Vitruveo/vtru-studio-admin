import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useDispatch } from '@/store/hooks';
import { roleCreateThunk } from '@/features/role';

const roleSchemaValidation = yup.object({
    name: yup.string().min(3, 'name field needs at least 3 characters').required('field name is required.'),
});

export default function RoleAdd() {
    const dispatch = useDispatch();

    const [modal, setModal] = React.useState(false);

    const { handleSubmit, handleChange, resetForm, values, errors } = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: roleSchemaValidation,
        onSubmit: async (payload) => {
            dispatch(
                roleCreateThunk({
                    name: payload.name,
                    description: payload.description,
                    permissions: [],
                })
            );

            toggle();
            resetForm();
        },
    });

    const toggle = () => {
        setModal(!modal);
    };

    return (
        <>
            <Box p={3} pb={1}>
                <Button color="primary" variant="contained" fullWidth onClick={toggle}>
                    Add New Role
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
                    Add New Role
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Lets add new role for your application. fill the all field and
                        <br /> click on submit button.
                    </DialogContentText>
                    <Box mt={3}>
                        <form onSubmit={handleSubmit}>
                            <Grid spacing={3} container>
                                <Grid item xs={12} lg={6}>
                                    <FormLabel>Name</FormLabel>
                                    <TextField
                                        id="name"
                                        name="name"
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        value={values.name}
                                        onChange={handleChange}
                                    />
                                    {errors?.name && <span>{errors.name}</span>}
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <FormLabel>Description</FormLabel>
                                    <TextField
                                        id="description"
                                        name="description"
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Box width="100%" paddingY={3} gap={1} display="flex" justifyContent="flex-end">
                                    <Button variant="outlined" color="error" onClick={toggle}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
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
