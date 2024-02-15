'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

import { useDispatch } from '@/store/hooks';
import { userLoginThunk } from '@/features/user/thunks';
import { codesVtruApi } from '@/services/codes';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';

import LoginView from './view';
import { loginSchemaValidation } from './formSchema';
import { AxiosError } from 'axios';

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
            try {
                const resUserLogin = await dispatch(
                    userLoginThunk({
                        email: formValues.email,
                    })
                );

                if (codesVtruApi.success.login.includes(resUserLogin.code)) {
                    router.push('/login/oneTimePassword');
                    return;
                } else {
                    setToastr({ open: true, type: 'error', message: 'Something went wrong! Try again later.' });
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 404) {
                    setToastr({ open: true, type: 'error', message: 'User not found!' });
                    return;
                }
            }
        },
    });

    return (
        <>
            <LoginView values={values} errors={errors} handleSubmit={handleSubmit} handleChange={handleChange} />
            <CustomizedSnackbar
                type={toastr.type}
                open={toastr.open}
                message={toastr.message}
                setOpentate={setToastr}
            />
        </>
    );
};

export default LoginContainer;
