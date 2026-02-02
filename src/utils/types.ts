export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string; // uuid ингредианта в бургере (ингредиенты могут повторятся)
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

/** ПОЛЬЗОВАТЕЛЬ */
export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

//! burger-api.ts ---------------------------------------------------

export type TServerResponse<T> = {
  success: boolean;
} & T;

export type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export type TIngredientsResponse = TServerResponse<{
  data: TIngredient[]; // ингредиенты
}>;

/** ОТВЕТ СЕРВЕРА НА ЗАПРОС ЛЕНТЫ ЗАКАЗОВ */
export type TFeedsResponse = TServerResponse<{
  orders: TOrder[]; // заказы
  total: number; // выполнено заказов за все время
  totalToday: number; //выполнено заказов за сегодня
}>;

export type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser | null;
}>;

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

//! vvk -------------------------------------------------------------

/** ДАННЫЕ, ИЗВЛЕЧЕННЫЕ ИЗ ОТВЕТА СЕРВЕРА */
export type ExtractResponseData<T> =
  T extends TServerResponse<infer U> ? U : never;

/** STORE STATE ИНГРЕДИЕНТОВ */
export interface TIngredientsState extends ExtractResponseData<TIngredientsResponse> {
  loading: boolean; // запрос выполняется?
  error: string | null; // сообщение об ошибке
}

/** STORE STATE ПОЛЬЗОВАТЕЛЯ (БЕЗ ТОКЕНОВ) */
export interface TUserState extends Omit<
  ExtractResponseData<TAuthResponse>,
  'refreshToken' | 'accessToken'
> {
  isAuthenticated: boolean; // user аутентифицирован?
  loading: boolean; // запрос выполняется?
  error: string | null; // сообщение об ошибке
}

/** STORE STATE ЛЕНТЫ ЗАКАЗОВ */
export interface IFeedsState extends ExtractResponseData<TFeedsResponse> {
  loading: boolean; // запрос выполняется?
  error: string | null; // сообщение об ошибке
}
