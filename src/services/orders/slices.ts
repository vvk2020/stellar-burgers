import { createSlice } from '@reduxjs/toolkit';
import { TOrdersState } from '../../utils/types';
import { createOrder } from './actions';

/** НАЧАЛЬНЫЙ STATE ЛЕНТЫ ЗАКАЗОВ */
const initialState: TOrdersState = {
  isRequested: false,
  data: [],
  lastOrder: null,
  error: null
};

/** SLICE ЛЕНТЫ ЗАКАЗОВ (БЕЗ АВТОРИЗАЦИИ) */
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Перед запросом ленты заказов
      .addCase(createOrder.pending, (state) => {
        state.isRequested = true;
        state.lastOrder = null;
        state.error = null;
      })
      // Запрос ленты заказов завершен с ошибкой
      .addCase(createOrder.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка запроса ленты заказов';
      })
      // Запрос ленты заказов успешно завершен
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          console.log('LASTORDER', action.payload);
          state.lastOrder = action.payload;
        }
      });
  },
  selectors: {
    // /** Селектор ленты заказов */
    // selectFeedsOrders: (state: IFeedsState) => state.orders,
    // /** Селектор статистики заказов (total, totalToday) */
    // selectFeedsStat: createSelector(
    //   [
    //     (state: IFeedsState) => state.total,
    //     (state: IFeedsState) => state.totalToday
    //   ],
    //   (total, totalToday) => ({ total, totalToday })
    // ),
    // /** Селектор заказа из ленты по его number */
    // selectFeedsOrderByNumber: createSelector(
    //   [
    //     (state: IFeedsState) => state.orders,
    //     (state: IFeedsState, orderNumber: number) => orderNumber
    //   ],
    //   (orders, orderNumber) => {
    //     if (!orderNumber) return null;
    //     return orders.find((order) => order.number === orderNumber) || null;
    //   }
    // ),

    /** Последний созданный заказ */
    selectLastOrder: (state: TOrdersState) => state.lastOrder
  }
});

export const {
  // selectFeedsOrders,
  // selectFeedsStat,
  // selectFeedsOrderByNumber,
  // selectFeedsLoadingState
} = ordersSlice.selectors;
