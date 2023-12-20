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
import { userAddThunk } from '@/features/user/slice';
import { UserApiResCreate } from '@/features/user/types';
import { UserType } from '@/mock/users';

const userSchemaValidation = yup.object({
  name: yup.string().required('field name is required.'),
  email: yup.string().email('invalid email.').required('field email is required.'),
});

interface Props {
  handleAddNewUser(params: UserType): void;
}

export default function UserAdd({ handleAddNewUser }: Props) {
  const dispatch = useDispatch();

  const [modal, setModal] = React.useState(false);

  const { handleSubmit, handleChange, resetForm, values, errors } = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: userSchemaValidation,
    onSubmit: async (payload) => {
      const response = await dispatch(
        userAddThunk({
          name: payload.name,
          login: { email: payload.email },
        }),
      );
      handleAddNewUser({
        _id: response.data?.insertedId || '',
        name: payload.name,
        login: { email: payload.email },
        roles: [],
        framework: {
          createdAt: null,
          updatedAt: null,
          createdBy: '',
          updatedBy: '',
        },
        profile: {
          avatar: '',
          language: '',
          location: '',
          phone: '',
        },
      });
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
          Add New User
        </Button>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" variant="h5">
          Add New User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lets add new user for your application. fill the all field and
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
                  <FormLabel>Email</FormLabel>
                  <TextField
                    id="email"
                    name="email"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors?.email && <span>{errors.email}</span>}
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
