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

//! из burger-api.ts ------------------------------------------------

export type TServerResponse<T> = {
  success: boolean;
} & T;

export type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

export type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
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
  user: TUser;
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

export interface TIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

/** STATE ПОЛЬЗОВАТЕЛЯ */
export interface TUserState {
  isProcessed: boolean; // авторизация/регистрация выполняется?
  isAuthenticated: boolean; // user аутентифицирован?
  user: TUser | null; // user-данные
  error: string | null; // сообщение об ошибке
}
