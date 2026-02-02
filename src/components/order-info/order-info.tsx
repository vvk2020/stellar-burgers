import { TIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { selectFeedsOrderByNumber } from '../../services/feeds/slices.';
import { selectIngredients } from '../../services/ingredients/slices';
import { useAppSelector } from '../../services/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  // Если background в location.state есть, то OrderInfo в модальном окне
  const location = useLocation();
  const isModalMode = !!location.state?.background;

  // Номер заказа
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number, 10) : 0;

  // Заказ из ленты по его номеру orderNumber
  const orderData = useAppSelector((state) =>
    selectFeedsOrderByNumber(state, orderNumber)
  );

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
