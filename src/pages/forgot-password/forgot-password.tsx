import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { FC, useMemo } from 'react';
import { useForm } from '../../hooks/useForm';

export const ForgotPassword: FC = () => {
  const initialValues = useMemo(() => ({ email: '' }), []);

  const { values, submitError, handleSubmit, navigate, updateField } = useForm({
    initialValues,
    validateOnSubmit: true,
    onSubmit: async ({ email }) => {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  });

  const handleEmailChange = (value: string) => {
    updateField('email', value);
  };

  return (
    <ForgotPasswordUI
      errorText={submitError}
      email={values.email}
      setEmail={handleEmailChange}
      handleSubmit={handleSubmit}
    />
  );
};
