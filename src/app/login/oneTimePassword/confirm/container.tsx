import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

import { useDispatch } from '@/store/hooks';
import { userLoginThunk, userOTPConfirmThunk } from '@/features/user/thunks';

import ConfirmView from './view';
import { otpSchemaValidation } from './formSchema';
import { userSelector } from '@/features/user';
import CustomizedSnackbar, { CustomizedSnackbarState } from '@/app/common/toastr';

export default function ConfirmContainer() {
  const [toastr, setToastr] = useState<CustomizedSnackbarState>({ type: 'success', open: false, message: '' });

  const dispatch = useDispatch();

  const {
    login: { email },
  } = useSelector(userSelector(['login']));

  const router = useRouter();

  const { handleSubmit, handleChange, values, errors, submitForm, validateForm } = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: otpSchemaValidation,
    onSubmit: async (formValues) => {
      const resOTPConfirm = await dispatch(
        userOTPConfirmThunk({
          code: formValues.code,
          email,
        }),
      );
      if (resOTPConfirm.meta.requestStatus === 'fulfilled') {
        setToastr({ open: true, type: 'success', message: 'OTP confirmed!' });
        router.push('/home');
        return;
      }

      if (resOTPConfirm.meta.requestStatus === 'rejected') {
        setToastr({ open: true, type: 'error', message: 'Login failed: invalid code' });
      }
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
    const resUserLogin = await dispatch(userLoginThunk({ email }));
    if (resUserLogin.meta.requestStatus === 'fulfilled') {
      //
    } else {
      //
    }
  };

  return (
    <>
      <ConfirmView
        values={values}
        errors={errors}
        handleResendCode={handleResendCode}
        handleChange={handleCustomChange}
        handleSubmit={handleSubmit}
      />
      <CustomizedSnackbar type={toastr.type} open={toastr.open} message={toastr.message} setOpentate={setToastr} />
    </>
  );
}
