import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TLoginData, TRegisterData } from '../../utils/types';
import { isErrorResponse } from '../../utils/types-guards';

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
    } catch (error: unknown) {
      return Promise.reject(
        isErrorResponse(error) ? error.message : 'Ошибка регистрации'
      );
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
    } catch (error: unknown) {
      return Promise.reject(
        isErrorResponse(error) ? error.message : 'Ошибка авторризации'
      );
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
  } catch (error: unknown) {
    return Promise.reject(
      isErrorResponse(error) ? error.message : 'Ошибка выхода из системы'
    );
  }
});

/** ASYNC ACTION ИЗМЕНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ */
export const updateUser = createAsyncThunk(
  'user/get',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

/** ASYNC ACTION ПОЛУЧЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
 * @returns {Promise<TUserResponse>} данные пользователя
 */
export const getUser = createAsyncThunk('user/update', async () =>
  getUserApi()
);
