import { RegisterUI } from '@ui-pages';
import { FC, useMemo } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAppDispatch } from '../../services/store';
import { registerUser } from '../../services/user/actions';

export const Register: FC = () => {
  const dispatch = useAppDispatch();

  const initialValues = useMemo(
    () => ({
      userName: '',
      email: '',
      password: ''
    }),
    []
  );

  const { values, submitError, handleSubmit, updateField } = useForm({
    initialValues,
    validateOnSubmit: true,
    onSubmit: async ({ email, userName, password }) => {
      await dispatch(
        registerUser({
          email,
          name: userName,
          password
        })
      );
    }
  });

  const handleEmailChange = (value: string) => {
    updateField('email', value);
  };

  const handlePasswordChange = (value: string) => {
    updateField('password', value);
  };

  const handleUserNameChange = (value: string) => {
    updateField('userName', value);
  };

  return (
    <RegisterUI
      errorText={submitError}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={handleEmailChange}
      setPassword={handlePasswordChange}
      setUserName={handleUserNameChange}
      handleSubmit={handleSubmit}
    />
  );
};
