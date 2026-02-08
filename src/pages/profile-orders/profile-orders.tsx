import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '../../components/ui';
import { getUserOrders } from '../../services/orders/actions';
import {
  selectOrdersRequestStatus,
  selectUserOrders
} from '../../services/orders/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const isUserOrdersRequested = useAppSelector(selectOrdersRequestStatus); // заказs пользователя

  useEffect(() => {
    dispatch(getUserOrders()); // запрос заказов пользователя
  }, [dispatch]);

  const orders = useAppSelector(selectUserOrders); // заказs пользователя

  if (isUserOrdersRequested) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
