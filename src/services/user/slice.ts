import { createSlice } from '@reduxjs/toolkit';
import { TUserState } from '../../utils/types';
import { loginUser, logoutUser, registerUser } from './actions';

/** НАЧАЛЬНЫЙ STATE ПОЛЬЗОВАТЕЛЯ */
const initialState: TUserState = {
  isRequested: false, // запрос НЕ выполняется
  isAuthenticated: false, // не аутентифицирован
  user: null, // user не определен
  error: null // ошибок нет
};

/** SLICE ПОЛЬЗОВАТЕЛЯ */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** Удаление данных о пользователе и его авторизации */
    deleteUser: (state) => {
      console.log('delUser');
      state.isAuthenticated = false; // user не аутентифицирован
      state.user = null; // сброс текущего user
      state.error = null; // ошибок нет
    }
  },
  extraReducers: (builder) => {
    builder
      // РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ

      // Перед регистрацией
      .addCase(registerUser.pending, (state) => {
        state.isRequested = true; // регистрация запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null; // сброс текущего user
        state.error = null; // ошибок нет
      })

      // Регистрация завершена с ошибкой
      .addCase(registerUser.rejected, (state, action) => {
        state.isRequested = false; // регистрация не выполняется
        state.error = action.error.message || 'Ошибка регистрации';
        console.error(state.error);
      })

      // Регистрация  успешно завершена
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRequested = false; // регистрация не выполняется
        if (action.payload.success) {
          state.isAuthenticated = true; // регистрация ✅
          state.user = action.payload.user; // передача данных пользователя
        }
      })

      // АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ

      // Перед авторизацией
      .addCase(loginUser.pending, (state) => {
        state.isRequested = true; // авторизация запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null;
        state.error = null;
      })

      // Аторизация завершена с ошибкой
      .addCase(loginUser.rejected, (state, action) => {
        state.isRequested = false; // авторизация не выполняется
        state.error = action.error.message || 'Ошибка авторизации';
        console.error(state.error);
      })

      // Авторизация успешно пройдена
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log('payload', action.payload);
        state.isRequested = false; // авторизация не выполняется
        if (action.payload.success) {
          state.isAuthenticated = true; // авторизация ✅
          state.user = action.payload.user;
        }
      })

      //! LOGOUT ПОЛЬЗОВАТЕЛЯ

      // Перед авторизацией
      .addCase(logoutUser.pending, (state) => {
        state.isRequested = true; // logout запущена
        state.isAuthenticated = false; // user не аутентифицирован
        state.user = null;
        state.error = null;
      })

      // Аторизация завершена с ошибкой
      .addCase(logoutUser.rejected, (state, action) => {
        state.isRequested = false; // logout не выполняется
        state.error = action.error.message || 'Logout-ошибка';
        console.error(state.error);
      })

      // Авторизация успешно пройдена
      .addCase(logoutUser.fulfilled, (state) => {
        state.isRequested = false; // logout не выполняется
      });

    // TODO MatchError - обработка всех rejected в одном блоке ?
  },
  selectors: {
    /** Селектор статуса завершения авторизации/регистрации */
    selectUserRequestStatus: (state: TUserState) => state.isRequested,

    /** Селектор данных пользователя */
    selectUser: (state: TUserState) => state.user,

    /** Селектор статуса авторизации пользователя */
    selectUserAuthStatus: (state: TUserState) => state.isAuthenticated
  }
});

export const { deleteUser } = userSlice.actions;
export const { selectUser, selectUserRequestStatus, selectUserAuthStatus } =
  userSlice.selectors;

export default userSlice.reducer;
