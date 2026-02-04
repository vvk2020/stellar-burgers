import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useAppDispatch } from '../../services/store';
import { loginUser } from '../../services/user/actions';

export const Login: FC = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Аутентификация по логину и паролю
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
