import { useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from '@/store/hooks';
import { userLoginThunk, userOTPConfirmThunk } from '@/features/user/thunks';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';
import { connectWebSocketThunk, loginWebSocketThunk } from '@/features/ws';
import { codesVtruApi } from '@/services/codes';

import ConfirmView from './view';
import { otpSchemaValidation } from './formSchema';
import { AxiosError } from 'axios';
import { useLoader } from '@/app/hooks/use-loader';

export default function ConfirmContainer() {
    const [toastr, setToastr] = useState<CustomizedSnackbarState>({ type: 'success', open: false, message: '' });
    const loader = useLoader();

    const dispatch = useDispatch();

    const login = useSelector((state) => state.user.login);

    const router = useRouter();

    const { handleSubmit, handleChange, values, errors, submitForm, validateForm, isSubmitting } = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: otpSchemaValidation,
        onSubmit: async (formValues) => {
            loader.start();
            try {
                const resOTPConfirm = await dispatch(
                    userOTPConfirmThunk({
                        code: formValues.code,
                        email: login?.email,
                    })
                );

                if (codesVtruApi.success.login.includes(resOTPConfirm.code)) {
                    await dispatch(connectWebSocketThunk());
                    await dispatch(loginWebSocketThunk());
                    setToastr({ open: true, type: 'success', message: 'OTP confirmed!' });
                    router.push('/home');
                    return;
                } else {
                    setToastr({ open: true, type: 'error', message: 'Login failed: invalid code' });
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                setToastr({ open: true, type: 'error', message: 'Login failed: invalid code' });
            }
            loader.stop();
        },
    });

    const handleCustomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);

        await validateForm();

        if (e.target.value.length === 6) {
            submitForm();
        }
    };

    const handleResendCode = async () => {
        const resUserLogin = await dispatch(userLoginThunk({ email: login?.email }));
        if (codesVtruApi.success.login.includes(resUserLogin.code)) {
            setToastr({ open: true, type: 'success', message: 'Code sent to your email!' });
        } else setToastr({ open: true, type: 'error', message: 'Something went wrong! Try again later.' });
    };

    return (
        <>
            <ConfirmView
                values={values}
                errors={errors}
                handleResendCode={handleResendCode}
                handleChange={handleCustomChange}
                handleSubmit={handleSubmit}
                isLoading={loader.isLoading}
            />
            <CustomizedSnackbar
                type={toastr.type}
                open={toastr.open}
                message={toastr.message}
                setOpentate={setToastr}
            />
        </>
    );
}
