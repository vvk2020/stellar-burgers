import { BurgerConstructorUI } from '@ui';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  selectConstructorItems,
  selectIngredientsIds,
  selectItemsTotal
} from '../../services/burger-constructor/slices';
import { createOrder } from '../../services/orders/actions';
import {
  deleteLastOrder,
  selectLastOrder,
  selectOrdersRequestStatus
} from '../../services/orders/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectUserAuthStatus } from '../../services/user/slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useAppSelector(selectConstructorItems); // ингредиенты кнструктора
  const price = useAppSelector(selectItemsTotal); // стоимость бургера
  const ids = useAppSelector(selectIngredientsIds); // _id булки и ингредиентов бургера в конструкторе
  const isAuthUser = useAppSelector(selectUserAuthStatus); // флаг: авторизованный пользователь?
  const orderRequest = useAppSelector(selectOrdersRequestStatus); // флаг: заказ выполняется?

  // Данные последнего зарегистрированного заказа
  const lastOrder = useAppSelector(selectLastOrder);
  const orderModalData = lastOrder ? lastOrder.order : null;

  // Handler кнопки "Оформить заказ"
  const onOrderClick = () => {
    // Отображение окна статуса офрмленного заказа, если его данные получены с сервера (orderRequest)
    if (!constructorItems.bun || orderRequest) return;
    // Пользователь авторизованный?
    if (isAuthUser) {
      dispatch(createOrder(ids)); // запрос на создание заказа бургер
    } else {
      navigate('/login', { state: { from: location } }); // пользователь должен авторизоваться
    }
  };

  /** Обработчик закрытия модального окна зарегистрированного заказа */
  const closeOrderModal = () => {
    // Очистка последнего заказа (для закрытия его модалки)
    if (orderModalData) dispatch(deleteLastOrder());
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
