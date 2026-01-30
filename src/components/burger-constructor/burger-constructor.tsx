import { BurgerConstructorUI } from '@ui';
import { FC } from 'react';
import {
  selectConstructorItems,
  selectItemsTotal
} from '../../services/burger-constructor/slices';
import { useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector(selectConstructorItems); // ингредиенты кнструктора
  const price = useAppSelector(selectItemsTotal); // стоимость бургера

  const orderRequest = false;
  const orderModalData = null;

  // Handler кнопки "Оформить заказ"
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };

  const closeOrderModal = () => {};

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
