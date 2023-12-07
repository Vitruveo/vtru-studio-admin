import * as yup from 'yup';

export const otpSchemaValidation = yup.object({
  code: yup.string().length(6, 'code field needs at least 6 characters').required('field code is required.'),
});
