import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useAppDispatch } from '../../services/store';
import { registerUser } from '../../services/user/actions';

export const Register: FC = () => {
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Регистрация на сервере, обновление store
    dispatch(
      registerUser({
        email,
        name: userName,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
