import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TFeedsState } from '../../utils/types';
import { fetchFeeds } from './actions';

/** НАЧАЛЬНЫЙ STATE ЛЕНТЫ ЗАКАЗОВ */
const initialState: TFeedsState = {
  isRequested: false,
  orders: [],
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
      // Перед запросом ленты заказов
      .addCase(fetchFeeds.pending, (state) => {
        state.isRequested = true;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.error = null;
      })

      // Запрос ленты заказов завершен с ошибкой
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка запроса ленты заказов';
        console.error(state.error);
      })

      // Запрос ленты заказов успешно завершен
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
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

    /** Селектор статуса загрузки ингредиентов */
    selectFeedsRequestStatus: (state: TFeedsState) => state.isRequested
  }
});

export const {
  selectFeedsOrders,
  selectFeedsStat,
  selectFeedsOrderByNumber,
  selectFeedsRequestStatus
} = feedsSlice.selectors;
