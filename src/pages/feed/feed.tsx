import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { selectFeedsOrders } from '../../services/feeds/slices.';
import { useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  // const constructorItems = useAppSelector(selectFeedsOrders); // лента заказов
  const orders: TOrder[] = useAppSelector(selectFeedsOrders); // лента заказов
  console.log('ORDERS', orders);
  console.log('!orders.length)', !orders.length);

  //! ДОбавить в feedsSlice вывод isProcessed <=> Preloader
  // if (!orders.length) {
  //   return <Preloader />;
  // }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
