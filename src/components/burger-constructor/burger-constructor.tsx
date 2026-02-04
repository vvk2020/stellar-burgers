import { BurgerConstructorUI } from '@ui';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clearConstructor,
  selectConstructorItems,
  selectIngredientsIds,
  selectItemsTotal
} from '../../services/burger-constructor/slices';
import { createOrder } from '../../services/orders/actions';
import {
  selectLastOrder,
  selectOrdersRequestState
} from '../../services/orders/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectUserAuthStatus } from '../../services/user/slice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector(selectConstructorItems); // ингредиенты кнструктора
  const price = useAppSelector(selectItemsTotal); // стоимость бургера

  const ids = useAppSelector(selectIngredientsIds); // id булки и ингредиентов бургера из конструктора
  const isAuthUser = useAppSelector(selectUserAuthStatus); // флаг: авторизованный пользователь?
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orderRequest = useAppSelector(selectOrdersRequestState); //! статус: заказ выполняется?

  // Данные последнего оформленного заказа
  const lastOrder = useAppSelector(selectLastOrder);
  const orderModalData = lastOrder ? lastOrder.order : null;

  console.log('=== 0 orderRequest, lastOrder', orderRequest, lastOrder);

  // Handler кнопки "Оформить заказ"
  const onOrderClick = () => {
    console.log(
      '=== 1 onOrderClick',
      constructorItems,
      ids,
      `isAuthUser: ${isAuthUser}`
    );
    // console.log('=== 2 onOrderClick', constructorItems, ids);

    // Отображение окна статуса офрмленного заказа, если его данные получены с сервера (orderRequest)
    if (!constructorItems.bun || orderRequest) return;
    if (isAuthUser) {
      console.log('BAC');
      dispatch(createOrder(ids)); // запрос на создание заказа бургер
      console.log('orderModalData', orderModalData);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const closeOrderModal = () => {
    // Очистка бургер-конструктора
    dispatch(clearConstructor());
  };

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
