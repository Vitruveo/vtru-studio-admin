'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

import { useDispatch } from '@/store/hooks';
import { userLoginThunk } from '@/features/auth/thunks';
import { codesVtruApi } from '@/services/codes';

import LoginView from './view';
import { loginSchemaValidation } from './formSchema';
import { AxiosError } from 'axios';
import { useToastr } from '@/app/hooks/use-toastr';

const LoginContainer = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const toastr = useToastr();

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
                    toastr.display({ type: 'error', message: 'Something went wrong! Try again later.' });
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 404) {
                    toastr.display({ type: 'error', message: 'User not found!' });
                    return;
                }
            }
        },
    });

    return (
        <>
            <LoginView values={values} errors={errors} handleSubmit={handleSubmit} handleChange={handleChange} />
        </>
    );
};

export default LoginContainer;
