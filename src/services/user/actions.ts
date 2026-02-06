import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TLoginData, TRegisterData } from '../../utils/types';

/** ASYNC ACTION РЕГИСТРАЦИИ ПОЛЬЗОВАТЕЛЯ НА СЕРВЕРЕ */
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    try {
      const resp = await registerUserApi(data);
      // Сохраняем токены после успешной регистрации
      if (resp.success && resp.accessToken && resp.refreshToken) {
        setCookie('accessToken', resp.accessToken);
        localStorage.setItem('refreshToken', resp.refreshToken);
      }
      return resp;
    } catch (error: any) {
      return Promise.reject(error.message || 'Ошибка регистрации');
    }
  }
);

/** ASYNC ACTION АВТОРИЗАЦИИ ПОЛЬЗОВАТЕЛЯ */
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    try {
      const resp = await loginUserApi(data);
      // Сохраняем токены после успешной регистрации
      if (resp.success && resp.accessToken && resp.refreshToken) {
        setCookie('accessToken', resp.accessToken);
        localStorage.setItem('refreshToken', resp.refreshToken);
      }
      return resp;
    } catch (error: any) {
      return Promise.reject(error.message || 'Ошибка регистрации');
    }
  }
);

/** ASYNC ACTION LOGOUT ПОЛЬЗОВАТЕЛЯ */
export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    const resp = await logoutApi();
    // Удаление токенов
    localStorage.clear(); // refreshToken
    deleteCookie('accessToken'); // accessToken
    return resp;
  } catch (error: any) {
    return Promise.reject(error.message || 'Logout-ошибка');
  }
});

/** ASYNC ACTION ИЗМЕНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ */
export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);
