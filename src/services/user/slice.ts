import { createSlice } from '@reduxjs/toolkit';
import { TUserState } from '../../utils/types';
import { loginUser, registerUser } from './actions';

/** НАЧАЛЬНЫЙ STATE ПОЛЬЗОВАТЕЛЯ */
const initialState: TUserState = {
  loading: false, // запрос НЕ выполняется
  isAuthenticated: false, // не аутентифицирован
  user: null, // user не определен
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
        state.loading = true; // регистрация запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null; // сброс текущего user
        state.error = null; // ошибок нет
      })

      // Регистрация завершена с ошибкой
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; // регистрация не выполняется
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Регистрация  успешно завершена
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; // регистрация не выполняется
        if (action.payload.success) {
          state.isAuthenticated = true; // user зарегистрирован (аутентифицирован)
          state.user = action.payload.user; // передача данных пользователя
        }
      })

      //! АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ

      // Перед авторизацией
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // авторизация запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null; // сброс текущего user
        state.error = null;
      })

      // Аторизация завершена с ошибкой
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // авторизация не выполняется
        state.error = action.error.message || 'Ошибка авторизации'; // передача ошибки
      })

      // Авторизация успешно пройдена
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log('payload', action.payload);
        state.loading = false; // авторизация не выполняется
        state.isAuthenticated = true; // авторизация ✅
        state.user = action.payload.user; // передача данных пользователя
      });
  }
});
