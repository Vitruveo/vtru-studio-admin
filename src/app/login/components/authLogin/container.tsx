'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

import { useDispatch } from '@/store/hooks';
import { userLoginThunk } from '@/features/user/thunks';

import { useState } from 'react';

import LoginView from './view';
import { loginSchemaValidation } from './formSchema';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';

const LoginContainer = () => {
  const [toastr, setToastr] = useState<CustomizedSnackbarState>({
    type: 'success',
    open: false,
    message: '',
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const { handleSubmit, handleChange, resetForm, values, errors } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: loginSchemaValidation,
    onSubmit: async (formValues) => {
      const resUserLogin = await dispatch(
        userLoginThunk({
          email: formValues.email,
        }),
      );
      if (resUserLogin.meta.requestStatus === 'fulfilled') {
        router.push('/login/oneTimePassword');
        return;
      }
      if (resUserLogin.meta.requestStatus === 'rejected') {
        setToastr({ open: true, type: 'error', message: 'Something went wrong! Try again later.' });
      }
    },
  });

  return (
    <>
      <LoginView values={values} errors={errors} handleSubmit={handleSubmit} handleChange={handleChange} />

      <CustomizedSnackbar type={toastr.type} open={toastr.open} message={toastr.message} setOpentate={setToastr} />
    </>
  );
};

export default LoginContainer;
