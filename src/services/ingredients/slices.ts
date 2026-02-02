import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TIngredientsState, TTabMode } from '@utils-types';
import { fetchIngredients } from './actions';

const initialState: TIngredientsState = {
  data: [],
  loading: false,
  error: null
};

/** SLICE РАБОТЫ С ИНГРЕДИЕНТАМИ */
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    //   addTodo: (state, action: PayloadAction<Todo>) => {
    //     state.todos.push(action.payload);
    //   },
    //   toggleTodo: (state, action: PayloadAction<string>) => {
    //     const todo = state.todos.find((todo) => todo.id === action.payload);
    //     if (todo) {
    //       todo.completed = !todo.completed;
    //     }
    //   },
    //   setFilter: (
    //     state,
    //     action: PayloadAction<"all" | "active" | "completed">
    //   ) => {
    //     state.filter = action.payload;
    //   },
    //   clearCompleted: (state) => {
    //     state.todos = state.todos.filter((todo) => !todo.completed);
    //   },
  },
  // Создание редюсеров внешних (асинхронных) actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка запроса ингредиентов';
      });
  },
  selectors: {
    /** Селектор всех ингредиентов */
    selectIngredients: (state: TIngredientsState) => state.data,

    /** Селектор статуса загрузки ингредиентов */
    selectIngredientsLoadingState: (state: TIngredientsState) => state.loading,

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
  selectIngredientsLoadingState,
  selectIngredientById
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
