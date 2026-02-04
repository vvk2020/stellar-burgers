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
        console.error(action.error);
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
    /** Последний созданный заказ */
    selectLastOrder: (state: TOrdersState) => state.lastOrder,

    /** Селектор статуса загрузки ингредиентов */
    selectOrdersRequestState: (state: TOrdersState) => state.isRequested
  }
});

export const { selectLastOrder, selectOrdersRequestState } =
  ordersSlice.selectors;
