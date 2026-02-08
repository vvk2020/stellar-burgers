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
  orders?: TOrder[];
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

/** ОТВЕТ СЕРВЕРА НА ЗАПРОС ЗАКАЗОВ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ */
export type TOrdersResponse = TServerResponse<{
  data: TOrder[]; // заказы
}>;

/** ДАННЫЕ СОЗДАННОГО ЗАКАЗА */
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

/** ОТВЕТ СЕРВЕРА НА ЗАПРОС ИЗМНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ */
export type TUserResponse = TServerResponse<{ user: TUser }>;

//! vvk -------------------------------------------------------------

//? БАЗОВЫЕ ТИПЫ ------------------------------------------

/** ДАННЫЕ, ИЗВЛЕЧЕННЫЕ ИЗ ОТВЕТА СЕРВЕРА */
export type ExtractResponseData<T> =
  T extends TServerResponse<infer U> ? U : never;

/** ДАННЫЕ ИЗ ОТВЕТА СЕРВЕРА С ПОЛЯМИ СТАТУСА ВЫПОЛНЕНИЯ ЗАПРОСА */
export type TResponseDataWithRequestStatus<T> = {
  isRequested: boolean; // запрос в процессе обработки?
  error: string | null; // сообщение об ошибке запроса
} & ExtractResponseData<T>;

//? ПРИКЛАДНЫЕ ТИПЫ ---------------------------------------

/** STORE STATE ИНГРЕДИЕНТОВ */
export type TIngredientsState =
  TResponseDataWithRequestStatus<TIngredientsResponse>;

/** STORE STATE ПОЛЬЗОВАТЕЛЯ (БЕЗ ТОКЕНОВ) */
export type TUserState = Omit<
  TResponseDataWithRequestStatus<TAuthResponse>,
  'refreshToken' | 'accessToken'
> & {
  isAuthenticated: boolean; // user аутентифицирован?
};

/** STORE STATE ЛЕНТЫ ЗАКАЗОВ */
export type TFeedsState = TResponseDataWithRequestStatus<TFeedsResponse> & {
  order: TOrder | null; // выбранный заказ (запрошенный с сервера)
};

/** STORE STATE ЗАКАЗОВ ПОЛЬЗОВАТЕЛЯ */
export type TOrdersState = TResponseDataWithRequestStatus<TOrdersResponse> & {
  lastOrder: ExtractResponseData<TNewOrderResponse> | null; // последний созданный заказ и его название
};

/** STORE STATE КОНСТРУКТОРА БУРГЕРА */
export interface IBurgerConstructorState {
  bun: TConstructorIngredient | undefined;
  ingredients: TConstructorIngredient[];
}

export type TErrorResponse = TServerResponse<{
  message: string;
}>;
