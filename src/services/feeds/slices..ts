import { createSelector, createSlice } from '@reduxjs/toolkit';
import { IFeedsState } from '../../utils/types';
import { fetchFeeds } from './actions';

/** НАЧАЛЬНЫЙ STATE ЛЕНТЫ ЗАКАЗОВ */
const initialState: IFeedsState = {
  loading: false,
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
        state.loading = true;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.error = null;
      })

      // Запрос ленты заказов завершен с ошибкой
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка запроса ленты заказов';
      })

      // Запрос ленты заказов успешно завершен
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          console.log('FEEDS', action.payload);
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      });
  },
  selectors: {
    /** Селектор ленты заказов */
    selectFeedsOrders: (state: IFeedsState) => state.orders,

    /** Селектор статистики заказов (total, totalToday) */
    selectFeedsStat: createSelector(
      [
        (state: IFeedsState) => state.total,
        (state: IFeedsState) => state.totalToday
      ],
      (total, totalToday) => ({ total, totalToday })
    ),

    /** Селектор заказа из ленты по его number */
    selectFeedsOrderByNumber: createSelector(
      [
        (state: IFeedsState) => state.orders,
        (state: IFeedsState, orderNumber: number) => orderNumber
      ],
      (orders, orderNumber) => {
        if (!orderNumber) return null;
        return orders.find((order) => order.number === orderNumber) || null;
      }
    )
  }
});

export const { selectFeedsOrders, selectFeedsStat, selectFeedsOrderByNumber } =
  feedsSlice.selectors;
