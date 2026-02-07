// src\pages\profile\profile.tsx
import { ProfileUI } from '@ui-pages';
import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { updateUser } from '../../services/user/actions';
import { selectUser } from '../../services/user/slice';

export const Profile: FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const initialValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    }),
    [user]
  );

  const { values, handleSubmit, updateField, setValues } = useForm({
    initialValues,
    onSubmit: async (formValue) => {
      await dispatch(updateUser(formValue));
    }
  });

  useEffect(() => {
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user, setValues]);

  const isFormChanged =
    values.name !== user?.name ||
    values.email !== user?.email ||
    !!values.password;

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.name as 'name' | 'email' | 'password', e.target.value);
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
