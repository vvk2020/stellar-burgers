import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TFeedsState } from '../../utils/types';
import { fetchFeeds, fetchFeedsOrder } from './actions';

/** НАЧАЛЬНЫЙ STATE ЛЕНТЫ ЗАКАЗОВ */
const initialState: TFeedsState = {
  isRequested: false,
  orders: [],
  order: null,
  total: 0,
  totalToday: 0,
  error: null
};

/** SLICE ЛЕНТЫ ЗАКАЗОВ (БЕЗ АВТОРИЗАЦИИ) */
export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //* ПОЛУЧЕНИЕ ЛЕНТЫ ЗАКАЗОВ
      .addCase(fetchFeeds.pending, (state) => {
        state.isRequested = true;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка запроса ленты заказов';
        console.error(state.error);
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      })

      //* ПОЛУЧЕНИЕ ЗАКАЗА ПО ЕГО НОМЕРУ
      .addCase(fetchFeedsOrder.pending, (state) => {
        state.isRequested = true;
        order: null;
        state.error = null;
      })
      .addCase(fetchFeedsOrder.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка запроса заказа по номеру';
        console.error(state.error);
      })
      .addCase(fetchFeedsOrder.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success)
          state.order = action.payload.orders[0] ?? null;
      });
  },
  selectors: {
    /** Селектор ленты заказов */
    selectFeedsOrders: (state: TFeedsState) => state.orders,

    /** Селектор статистики заказов (total, totalToday) */
    selectFeedsStat: createSelector(
      [
        (state: TFeedsState) => state.total,
        (state: TFeedsState) => state.totalToday
      ],
      (total, totalToday) => ({ total, totalToday })
    ),

    /** Селектор заказа из ленты по его number */
    selectFeedsOrderByNumber: createSelector(
      [
        (state: TFeedsState) => state.orders,
        (state: TFeedsState, orderNumber: number) => orderNumber
      ],
      (orders, orderNumber) => {
        if (!orderNumber) return null;
        return orders.find((order) => order.number === orderNumber) || null;
      }
    ),
    /** Заказ, полученный с сервера по его number */
    requestFeedsOrderByNumber: (state: TFeedsState) => state.order,

    /** Селектор статуса загрузки ингредиентов */
    selectFeedsRequestStatus: (state: TFeedsState) => state.isRequested
  }
});

export const {
  selectFeedsOrders,
  selectFeedsStat,
  selectFeedsOrderByNumber,
  selectFeedsRequestStatus,
  requestFeedsOrderByNumber
} = feedsSlice.selectors;
