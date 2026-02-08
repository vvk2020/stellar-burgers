import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TOrdersState } from '../../utils/types';
import { createOrder, getUserOrders } from './actions';

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
  reducers: {
    /** Удаление данных о последнем заказе */
    deleteLastOrder: (state) => {
      state.lastOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //* АВТОРИЗОВАННОЕ ОФОРМЛЕНИЕ ЗАКАЗА БУРГЕРА ИЗ КОНСТРУКТОРА
      .addCase(createOrder.pending, (state) => {
        state.isRequested = true;
        state.lastOrder = null;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isRequested = false;
        state.error =
          action.error.message || 'Ошибка запроса оформления заказа';
        console.error(action.error);
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.lastOrder = action.payload;
        }
      })

      //* АВТОРИЗОВАННОЕ ПОЛУЧЕНИЕ ЗАКАЗОВ ПОЛЬЗОВАТЕЛЯ
      .addCase(getUserOrders.pending, (state) => {
        state.isRequested = true;
        state.data = [];
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isRequested = false;
        state.error =
          action.error.message || 'Ошибка запроса заказов пользователя';
        console.error(action.error);
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isRequested = false;
        state.data = action.payload;
      });
  },
  selectors: {
    /** Последний созданный заказ */
    selectLastOrder: (state: TOrdersState) => state.lastOrder,
    /** Cтатус выполнения запроса  */
    selectOrdersRequestStatus: (state: TOrdersState) => state.isRequested,
    /** Заказы пользователя */
    selectUserOrders: (state: TOrdersState) => state.data,
    /** Селектор заказа пользователя его number */
    selectUserOrderByNumber: createSelector(
      [
        (state: TOrdersState) => state.data,
        (state: TOrdersState, orderNumber: number) => orderNumber
      ],
      (orders, orderNumber) => {
        if (!orderNumber) return null;
        return orders.find((order) => order.number === orderNumber) || null;
      }
    )
  }
});

export const { deleteLastOrder } = ordersSlice.actions;
export const {
  selectLastOrder,
  selectOrdersRequestStatus,
  selectUserOrders,
  selectUserOrderByNumber
} = ordersSlice.selectors;
