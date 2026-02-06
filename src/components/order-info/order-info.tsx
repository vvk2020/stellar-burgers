import { TIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchFeedsOrder } from '../../services/feeds/actions';
import {
  requestFeedsOrderByNumber,
  selectFeedsOrderByNumber,
  selectFeedsOrders,
  selectFeedsRequestStatus
} from '../../services/feeds/slices';
import { selectIngredients } from '../../services/ingredients/slices';
import { selectUserOrderByNumber } from '../../services/orders/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  // Если background в location.state, то OrderInfo в модальном окне
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isModalMode = !!location.state?.background;
  // Номер заказа из маршрута
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number, 10) : 0;

  const feeedsOrders = useAppSelector(selectFeedsOrders);
  const isFeeedsOrdersRequested = useAppSelector(selectFeedsRequestStatus);

  // Выбор заказа по его номеру orderNumber
  const orderData = useAppSelector((state) => {
    // Если заказ в модальном окне, то он выбирается в зависимости от маршрута
    // (заказы ленты - из feedsSlice, пользователя - из ordersSlice)
    if (isModalMode) {
      return location.pathname.includes('/profile/orders/')
        ? selectUserOrderByNumber(state, orderNumber)
        : selectFeedsOrderByNumber(state, orderNumber);
    }
    // Если заказ открыт по прямой ссылке (store пустой), то запрос с сервера + select из feedsSlice
    return requestFeedsOrderByNumber(state);
  });

  // Если переход по прямой ссылке из ленты заказов, то запрос заказа с сервера
  useEffect(() => {
    if (
      location.pathname.includes('/feed/') &&
      !isModalMode &&
      !isFeeedsOrdersRequested
    ) {
      dispatch(fetchFeedsOrder(orderNumber));
    }
  }, []);

  // Ингредиенты
  const ingredients = useAppSelector(selectIngredients); // ингредиенты

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModalMode} />;
};
