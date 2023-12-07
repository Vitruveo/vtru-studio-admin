import { FormikErrors } from 'formik';

import { FormikDefaultProps } from '@/app/common/types';

interface OTPConfirmFormValues {
  code: string;
}

type OTPConfirmFormErros = FormikErrors<OTPConfirmFormValues>;

export interface OTPConfirmViewProps extends FormikDefaultProps {
  values: OTPConfirmFormValues;
  errors: OTPConfirmFormErros;
  handleResendCode: () => void;
}
