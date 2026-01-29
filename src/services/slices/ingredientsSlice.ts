import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { IngredientsState, TTabMode } from '@utils-types';

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

/** ASYNC ACTION ПОЛУЧЕНИЯ ВСЕХ ИНГРЕДИЕНТОВ С СЕРВЕРА */
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi()
);

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
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    // Селектор всех ингредиентов
    selectIngredients: (state: IngredientsState) => state.ingredients
  }
});

/** БАЗОВЫЙ СЕЛЕКТОР ВСЕХ ИНГРЕДИЕНТОВ */
export const selectAllIngredients = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.ingredients;

/** ФАБРИЧНЫЙ СЕЛЕКТОР ИНГРЕДИЕНТОВ ПОТ ТИПАМ С МЕМОИЗАЦИЕЙ */
export const makeSelectIngredientsByType = () =>
  createSelector(
    [selectAllIngredients, (_, type: TTabMode) => type],
    (ingredients, type) => ingredients.filter((item) => item.type === type)
  );

// export const { addTodo, toggleTodo, setFilter, clearCompleted } =
//   todosSlice.actions;
export const { selectIngredients } = ingredientsSlice.selectors;
// export const { selectIngredientsState } = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
