import { BurgerConstructorUI } from '@ui';
import { FC } from 'react';
import {
  selectConstructorItems,
  selectIngredientsIds,
  selectItemsTotal
} from '../../services/burger-constructor/slices';
import { useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector(selectConstructorItems); // ингредиенты кнструктора
  const price = useAppSelector(selectItemsTotal); // стоимость бургера
  const ids = useAppSelector(selectIngredientsIds); // id булки и ингредиентов бургера из конструктора

  const orderRequest = false; //! статус: заказ выполняется?
  const orderModalData = null; //! данные оформленного заказа (сервера)

  // Handler кнопки "Оформить заказ"
  const onOrderClick = () => {
    console.log('onOrderClick', constructorItems, ids);
    // Отображение окна статуса офрмленного заказа, если его данные получены с сервера (orderRequest)
    if (!constructorItems.bun || orderRequest) return;
    // return <Navigate replace to='/login' />;
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
