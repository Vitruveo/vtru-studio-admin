import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from '@/store/hooks';
import { userLoginThunk, userOTPConfirmThunk } from '@/features/auth/thunks';
import { connectWebSocketThunk, loginWebSocketThunk } from '@/features/ws';
import { codesVtruApi } from '@/services/codes';

import ConfirmView from './view';
import { otpSchemaValidation } from './formSchema';
import { AxiosError } from 'axios';
import { useLoader } from '@/app/hooks/use-loader';
import { useToastr } from '@/app/hooks/use-toastr';

export default function ConfirmContainer() {
    const loader = useLoader();
    const dispatch = useDispatch();
    const login = useSelector((state) => state.auth.login);
    const router = useRouter();
    const toastr = useToastr();

    const { handleSubmit, handleChange, values, errors, submitForm, validateForm, isSubmitting } = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: otpSchemaValidation,
        onSubmit: async (formValues) => {
            loader.start();

            await dispatch(
                userOTPConfirmThunk({
                    code: formValues.code,
                    email: login?.email,
                })
            )
                .then(() => router.push('/home'))
                .finally(() => loader.stop());
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
            toastr.display({ type: 'success', message: 'Code sent to your email!' });
        } else toastr.display({ type: 'error', message: 'Something went wrong! Try again later.' });
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
        </>
    );
}
