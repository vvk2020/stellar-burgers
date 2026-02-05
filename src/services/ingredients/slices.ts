import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TIngredientsState, TTabMode } from '@utils-types';
import { fetchIngredients } from './actions';

const initialState: TIngredientsState = {
  data: [],
  isRequested: false,
  error: null
};

/** SLICE РАБОТЫ С ИНГРЕДИЕНТАМИ */
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  // Создание редюсеров внешних (асинхронных) actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isRequested = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isRequested = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.error.message || 'Ошибка запроса ингредиентов';
        console.error(state.error);
      });
  },
  selectors: {
    /** Селектор всех ингредиентов */
    selectIngredients: (state: TIngredientsState) => state.data,

    /** Селектор статуса загрузки ингредиентов */
    selectIngredientsRequestState: (state: TIngredientsState) =>
      state.isRequested,

    /** Селектор ингредиента по его id */
    selectIngredientById:
      (state: TIngredientsState) => (ingredientId: string | undefined) => {
        if (!ingredientId) return;
        return (
          state.data.find((ingredient) => ingredient._id === ingredientId) ||
          null
        );
      }
  }
});

/** БАЗОВЫЙ СЕЛЕКТОР ВСЕХ ИНГРЕДИЕНТОВ */
export const selectAllIngredients = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.data;

/** ФАБРИЧНЫЙ СЕЛЕКТОР ИНГРЕДИЕНТОВ ПОТ ТИПАМ С МЕМОИЗАЦИЕЙ */
export const makeSelectIngredientsByType = () =>
  createSelector(
    [selectAllIngredients, (_, type: TTabMode) => type],
    (ingredients, type) => ingredients.filter((item) => item.type === type)
  );

// export const { addTodo, toggleTodo, setFilter, clearCompleted } =
//   todosSlice.actions;
export const {
  selectIngredients,
  selectIngredientsRequestState,
  selectIngredientById
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
