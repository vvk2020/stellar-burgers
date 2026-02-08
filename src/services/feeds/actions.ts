import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';

/** ASYNC ACTION ПОЛУЧЕНИЯ ЛЕНТЫ ЗАКАЗОВ (БЕЗ АВТОРИЗАЦИИ) */
export const fetchFeeds = createAsyncThunk('feeds/all', async () =>
  getFeedsApi()
);

/** ASYNC ACTION ПОЛУЧЕНИЯ ЗАКАЗА ПО ЕГО НОМЕРУ (БЕЗ АВТОРИЗАЦИИ) */
export const fetchFeedsOrder = createAsyncThunk(
  'feeds/order',
  async (orderNuber: number) => getOrderByNumberApi(orderNuber)
);
