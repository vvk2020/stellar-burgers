import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { fetchFeeds } from './actions';

/** STATE ЛЕНТЫ ЗАКАЗОВ */
export interface IFeedsState {
  isProcessed: boolean; // запрос выполняется?
  orders: TOrder[]; // заказы
  error: string | null; // сообщение об ошибке
}

/** НАЧАЛЬНЫЙ STATE ЛЕНТЫ ЗАКАЗОВ */
const initialState: IFeedsState = {
  isProcessed: false,
  orders: [],
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
        state.isProcessed = true; // запрос запущен
        state.orders = []; // сброс текущей ленты
        state.error = null;
      })

      // Запрос ленты заказов завершен с ошибкой
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isProcessed = false; // запрос не выполняется
        state.error = action.error.message || 'Ошибка запроса ленты заказов';
      })

      // Запрос ленты заказов успешно завершен
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isProcessed = false; // запрос не выполняется
        if (action.payload.success) {
          console.log('FEEDS', action.payload);
          state.orders = action.payload.orders; // передача заказов
        }
      });
  },
  selectors: {
    /** Селектор ленты заказов */
    // selectOrdersFeeds: (state: IFeedsState) => [...state.orders]
    selectFeedsOrders: createSelector(
      [(state: IFeedsState) => state.orders],
      (orders) => [...orders]
    )
  }
});

export const { selectFeedsOrders } = feedsSlice.selectors;
