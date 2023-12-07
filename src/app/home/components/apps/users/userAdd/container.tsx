import { useFormik } from 'formik';
import {
  useCallback,
  useState,
} from 'react';

import { useDispatch } from '../../../../../../store/hooks';
import { userAddSchemaValidation } from './formSchema';
import UserAdd from './view';
import { userAddThunk } from '@/features/user/thunks';

export default function Container() {
  const [showModal, setShowModal] =
    useState(false);

  const dispatch = useDispatch();

  const {
    handleSubmit,
    handleChange,
    resetForm,
    values,
    errors,
  } = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema:
      userAddSchemaValidation,
    onSubmit: async (formValues) => {
      formValues.email;
      dispatch(
        userAddThunk(formValues)
      );
    },
  });

  const handleChangeModal =
    useCallback(() => {
      setShowModal(
        (current) => !current
      );
    }, []);

  return (
    <UserAdd
      values={values}
      showModal={showModal}
      errors={errors}
      handleChangeModal={
        handleChangeModal
      }
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
