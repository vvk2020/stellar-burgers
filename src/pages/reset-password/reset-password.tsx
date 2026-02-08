import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  const initialValues = useMemo(
    () => ({
      password: '',
      token: ''
    }),
    []
  );

  const { values, submitError, handleSubmit, updateField } = useForm({
    initialValues,
    validateOnSubmit: true,
    onSubmit: async ({ password, token }) => {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      navigate('/login');
    }
  });

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handlePasswordChange = (value: string) => {
    updateField('password', value);
  };

  const handleTokenChange = (value: string) => {
    updateField('token', value);
  };

  return (
    <ResetPasswordUI
      errorText={submitError}
      password={values.password}
      token={values.token}
      setPassword={handlePasswordChange}
      setToken={handleTokenChange}
      handleSubmit={handleSubmit}
    />
  );
};
