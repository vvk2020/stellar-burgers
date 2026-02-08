import { createSlice } from '@reduxjs/toolkit';
import { TUserState } from '../../utils/types';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './actions';

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
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //* РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
      .addCase(registerUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка регистрации';
        console.error(state.error);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })

      //* АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ
      .addCase(loginUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка авторизации';
        console.error(state.error);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })

      //* LOGOUT ПОЛЬЗОВАТЕЛЯ
      .addCase(logoutUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Logout-ошибка';
        console.error(state.error);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isRequested = false;
      })

      //* ИЗМЕНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
      .addCase(updateUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isRequested = false;
        state.error =
          action.error.message || 'Ошибка изменения данных пользователя';
        console.error(state.error);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })

      //* ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
      .addCase(getUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isRequested = false;
        state.error =
          action.error.message || 'Ошибка получения данных пользователя';
        console.error(state.error);
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      });
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
