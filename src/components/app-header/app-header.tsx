import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/user/slice';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);
  const name = user?.name || '';
  return <AppHeaderUI userName={name} />;
};
