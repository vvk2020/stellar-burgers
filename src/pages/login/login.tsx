import { LoginUI } from '@ui-pages';
import { FC, useMemo } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAppDispatch } from '../../services/store';
import { loginUser } from '../../services/user/actions';

export const Login: FC = () => {
  const dispatch = useAppDispatch();

  const initialValues = useMemo(
    () => ({
      email: '',
      password: ''
    }),
    []
  );

  const { values, submitError, handleSubmit, updateField } = useForm({
    initialValues,
    validateOnSubmit: true,
    onSubmit: async ({ email, password }) => {
      await dispatch(loginUser({ email, password }));
    }
  });

  const handleEmailChange = (value: string) => {
    updateField('email', value);
  };

  const handlePasswordChange = (value: string) => {
    updateField('password', value);
  };

  return (
    <LoginUI
      errorText={submitError}
      email={values.email}
      setEmail={handleEmailChange}
      password={values.password}
      setPassword={handlePasswordChange}
      handleSubmit={handleSubmit}
    />
  );
};
