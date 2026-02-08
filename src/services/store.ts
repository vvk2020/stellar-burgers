import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { burgerConstructorSlice } from './burger-constructor/slices';
import { feedsSlice } from './feeds/slices';
import { ingredientsSlice } from './ingredients/slices';
import { ordersSlice } from './orders/slices';
import { userSlice } from './user/slice';

const rootReducer = combineSlices(
  ingredientsSlice, // ингредиенты
  burgerConstructorSlice, // конструктор бургера
  userSlice, // пользователь
  feedsSlice, // лента заказов
  ordersSlice // заказы пользователя
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
