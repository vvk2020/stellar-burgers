import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import {
  selectUser,
  selectUserAuthStatus,
  selectUserRequestStatus
} from '../../services/user/slice';
import { Preloader } from '../ui';

export type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthRequested = useAppSelector(selectUserRequestStatus); // статус: авторизация/регистрация выполняется?
  // const isAuthChecked = useAppSelector(selectUserLoadingState); //! состояния загрузки пользователя ИЛИ LOADING ???
  const user = useAppSelector(selectUser); // данные пользователя
  const userAuthStatus = useAppSelector(selectUserAuthStatus); // данные пользователя

  // Если авторизация/регистрация не завершена, то показываем Preloader
  if (isAuthRequested) {
    return <Preloader />;
  }

  if (!user || !userAuthStatus) {
    // если пользователя в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  return children;
};
