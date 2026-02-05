import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '../../components/ui';
import { fetchFeeds } from '../../services/feeds/actions';
import {
  selectFeedsOrders,
  selectFeedsRequestStatus
} from '../../services/feeds/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  const orders = useAppSelector(selectFeedsOrders); // лента заказов
  const dispatch = useAppDispatch();
  const isFeedsRequested = useAppSelector(selectFeedsRequestStatus); // состояния загрузки
  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  const handleGetFeeds = () => {
    if (!isFeedsRequested) dispatch(fetchFeeds());
  };

  if (isFeedsRequested) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
