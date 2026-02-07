import { getCookie, setCookie } from './cookie';
import {
  TAuthResponse,
  TFeedsResponse,
  TIngredientsResponse,
  TLoginData,
  TNewOrderResponse,
  TOrderResponse,
  TRefreshResponse,
  TRegisterData,
  TServerResponse,
  TUserResponse
} from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

/** НЕАВТОРИЗОВАННОЕ ПОЛУЧЕНИЕ ИНГРЕДИЕНТОВ
 * @return {Promise<TIngredient[]>} Лента заказов
 */
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

/** НЕАВТОРИЗОВАННОЕ ПОЛУЧЕНИЕ ЛЕНТЫ ЗАКАЗОВ
 * @return {Promise<TFeedsResponse>} Лента заказов
 */
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/** АВТОРИЗОВАННОЕ ПОЛУЧЕНИЕ ЗАКАЗОВ ПОЛЬЗОВАТЕЛЯ
 * @return {Promise<TOrder[]>} Заказы
 */
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

/** АВТОРИЗОВАННОЕ СОЗДАНИЕ НОВОГО ЗАКАЗА БУРГЕРА ИЗ КОНСТРУКТОРА
 * @param {string[]} data Массив идентификаторов булки и ингредиентов
 * @return {Promise<TNewOrderResponse>} Созданный заказ
 */
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

/** АВТОРИЗОВАННОЕ ПОЛУЧЕНИЕ ЗАКАЗА ПО НОМЕРУ
 * @return {Promise<TOrderResponse>} Заказы
 */
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

/** РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ ПО ЛОГИНУ, ПАРОЛЮ И EMAIL
 * @param {TRegisterData} data - данные для регистрации {email, name, password}
 * @returns {Promise<TAuthResponse>} - ответ сервера в формате { refreshToken, accessToken, user }
 * */
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/** АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ НА СЕРВЕРЕ ПО ЛОГИНУ И ПАРОЛЮ
 * @param {TLoginData} data - данные для авторизации {email, password}
 * @returns {Promise<TAuthResponse>} - ответ сервера в формате { success, refreshToken, accessToken, TUser }
 */
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/** АВТОРИЗОВАННОЕ ВОССТАНОВЛЕНИЕ ПАРОЛЯ ПОЛЬЗОВАТЕЛЯ ЧЕРЕЗ EMAIL
 * @param {string} email Электронная почта
 */
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/** АВТОРИЗОВАННЫЙ СБРОС ПАРОЛЯ ПОЛЬЗОВАТЕЛЯ
 * @param {{ password: string; token: string }} data - пароль и токен
 * @returns {Promise<{success: boolean}>} - статус изменения пароля
 * */
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/** АВТОРИЗОВАННОЕ ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
 * @returns {Promise<TUserResponse>} данные пользователя
 */
export const getUserApi = () => {
  const accessToken = getCookie('accessToken');
  return accessToken
    ? fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
        headers: {
          authorization: accessToken
        } as HeadersInit
      })
    : Promise.reject(
        new Error(
          'Ошибка запроса данных пользователя: access-токен отсутствует'
        )
      );
};

/** АВТОРИЗОВАННОЕ ИЗМЕНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
 * @param {{ password: string; token: string }} data - пароль и токен
 * @returns {Promise<TUserResponse>} - статус изменения пароля
 * */
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

/** LOGOUT ПОЛЬЗОВАТЕЛЯ
 * @returns {Promise<TAuthResponse>} - ответ сервера в формате { success }
 */
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
