import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectUser, selectUserRequestStatus } from '../../services/user/slice';
import { Preloader } from '../ui';

export type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthRequested = useAppSelector(selectUserRequestStatus); // статус: авторизация/регистрация выполняется?
  // const isAuthChecked = useAppSelector(selectUserLoadingState); //! состояния загрузки пользователя ИЛИ LOADING ???
  const user = useAppSelector(selectUser); // данные пользователя
  // const userAuthStatus = useAppSelector(selectUserAuthStatus); // данные пользователя
  const location = useLocation();

  // console.log('user', user, 'isAuthRequested', isAuthRequested);

  // Если авторизация/регистрация не завершена, то показываем Preloader
  if (isAuthRequested) {
    return <Preloader />;
  }

  // Если маршрут для авторизованного пользователя, но он не авторизован, то редирект на /login
  if (!onlyUnAuth && !user) {
    // если пользователя в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут для неавторизованного пользователя, но он авторизован при обратном редиректе
  // получаем данные о месте назначения редиректа из объекта location.state
  if (onlyUnAuth && user) {
    // В случае, если объекта location.state?.from нет, если зашли на страницу логина по прямому URL
    // создаём объект c указанием адреса и делаем переадресацию на главную страницу
    console.log('location:', location);
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
