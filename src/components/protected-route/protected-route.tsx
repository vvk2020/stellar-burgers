import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectUser, selectUserLoadingState } from '../../services/user/slice';
import { Preloader } from '../ui';

export type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthChecked = useAppSelector(selectUserLoadingState); // состояния загрузки пользователя
  const user = useAppSelector(selectUser); // данные пользователя

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!user) {
    // если пользователя в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  return children;
};
