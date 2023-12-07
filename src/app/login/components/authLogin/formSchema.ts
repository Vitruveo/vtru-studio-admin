import * as yup from 'yup';

export const loginSchemaValidation = yup.object({
  email: yup.string().email().required('field email is required.'),
});
