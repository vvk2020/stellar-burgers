import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { loginUser, registerUser } from './actions';

/** STATE ПОЛЬЗОВАТЕЛЯ */
export interface TUserState {
  isProcessed: boolean; // авторизация/регистрация выполняется?
  isAuthenticated: boolean; // user аутентифицирован?
  user: TUser | null; // user-данные
  error: string | null; // сообщение об ошибке
}
/** НАЧАЛЬНЫЙ STATE ПОЛЬЗОВАТЕЛЯ */
const initialState: TUserState = {
  isProcessed: false, // аутентификация/регистрация НЕ выполняется
  isAuthenticated: false, // не аутентифицирован
  user: null, // данных user нет
  error: null // ошибок нет
};

/** SLICE ПОЛЬЗОВАТЕЛЯ */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //! РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ

      // Перед регистрацией
      .addCase(registerUser.pending, (state) => {
        state.isProcessed = true; // регистрация запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null; // сброс текущего user
        state.error = null; // ошибок нет
      })

      // Регистрация завершена с ошибкой
      .addCase(registerUser.rejected, (state, action) => {
        state.isProcessed = false; // регистрация не выполняется
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Регистрация  успешно завершена
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isProcessed = false; // регистрация не выполняется
        if (action.payload.success) {
          state.isAuthenticated = true; // user зарегистрирован (аутентифицирован)
          state.user = action.payload.user; // передача данных пользователя
        }
      })

      //! АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ

      // Перед авторизацией
      .addCase(loginUser.pending, (state) => {
        state.isProcessed = true; // авторизация запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null; // сброс текущего user
        state.error = null;
      })

      // Аторизация завершена с ошибкой
      .addCase(loginUser.rejected, (state, action) => {
        state.isProcessed = false; // авторизация не выполняется
        state.error = action.error.message || 'Ошибка авторизации'; // передача ошибки
      })

      // Авторизация успешно пройдена
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log('payload', action.payload);
        state.isProcessed = false; // авторизация не выполняется
        state.isAuthenticated = true; // авторизация ✅
        state.user = action.payload.user; // передача данных пользователя
      });
  }
});
