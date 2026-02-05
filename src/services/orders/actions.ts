import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api';
import { clearConstructor } from '../burger-constructor/slices';

/** ASYNC ACTION АВТОРИЗОВАННОГО ОФОРМЛЕНИЯ ЗАКАЗА БУРГЕРА ИЗ КОНСТРУКТОРА
 * @param {string[]} ids Массив идентификаторов ингредиентов и булки
 * @return {Promise<TNewOrderResponse>} Данные созданного заказа
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ids: string[], { dispatch }) => {
    const resp = await orderBurgerApi(ids);
    // Если заказ успешно оформлен, то очистка конструктора бургера
    if (resp?.success) dispatch(clearConstructor());
    return resp;
  }
);

/** ASYNC ACTION АВТОРИЗОВАННОГО ПОЛУЧЕНИЕ ЗАКАЗОВ ПОЛЬЗОВАТЕЛЯ
 * @return {Promise<TOrder[]>} Заказы
 */
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => getOrdersApi()
);

//! 2. Асинхронный action запрос заказа по номеру
