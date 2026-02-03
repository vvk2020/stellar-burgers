import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { Preloader } from '../../components/ui';
import { fetchFeeds } from '../../services/feeds/actions';
import {
  selectFeedsOrders,
  selectFeedsRequestStatus
} from '../../services/feeds/slices.';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  // const constructorItems = useAppSelector(selectFeedsOrders); // лента заказов
  const orders: TOrder[] = useAppSelector(selectFeedsOrders); // лента заказов
  const dispatch = useAppDispatch();
  const isFeedsRequested = useAppSelector(selectFeedsRequestStatus); // состояния загрузки пользователя

  useEffect(() => {
    dispatch(fetchFeeds()); // запрос заказов в ленту
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isFeedsRequested) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
