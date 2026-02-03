import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

/** ASYNC ACTION АВТОРИЗОВАННОГО ОФОРМЛЕНИЯ ЗАКАЗА БУРГЕРА, СОЗДАННОГО В КОНСТРУКТОРЕ
 * @param {string[]} ids Массив идентификаторов ингредиентов и булки
 * @return {Promise<TNewOrderResponse>} Данные созданного заказа
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ids: string[]) => orderBurgerApi(ids)
);

//! 0. getOrdersApi() с авторизацией
//! 2. Асинхронный action запрос заказа по номеру
