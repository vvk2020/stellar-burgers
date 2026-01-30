// import { createSelector, createSlice } from '@reduxjs/toolkit';
// import { IngredientsState, TTabMode } from '@utils-types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TConstructorIngredient = Pick<
  TIngredient,
  '_id' | 'name' | 'price' | 'image'
>;

export interface IBurgerConstructorState {
  bun: TConstructorIngredient | undefined;
  ingredients: TConstructorIngredient[];
}

const initialState: IBurgerConstructorState = {
  bun: undefined,
  ingredients: []
};

/** SLICE КОНСТРУКТОРА БУРГЕРА */
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      switch (action.payload.type) {
        case 'bun': {
          state.bun = { ...action.payload };
          break;
        }
        case 'main':
        case 'sauce': {
          state.ingredients = [...state.ingredients, action.payload];
          break;
        }
        default:
          console.error('Неизвестный тип ингредиента');
      }
    }
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
    // builder
    //   .addCase(fetchIngredients.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchIngredients.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.ingredients = action.payload;
    //   })
    //   .addCase(fetchIngredients.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
  selectors: {
    /** Селектор всех ингредиентов конструктора */
    selectConstructorItems: (state: IBurgerConstructorState) => ({
      bun: state.bun ? { ...state.bun } : undefined,
      ingredients: [...state.ingredients] // поверхностное копирование массива
    })
  }
});

// /** БАЗОВЫЙ СЕЛЕКТОР ВСЕХ ИНГРЕДИЕНТОВ */
// export const selectAllIngredients = (state: {
//   ingredients: IngredientsState;
// }) => state.ingredients.ingredients;

// /** ФАБРИЧНЫЙ СЕЛЕКТОР ИНГРЕДИЕНТОВ ПОТ ТИПАМ С МЕМОИЗАЦИЕЙ */
// export const makeSelectIngredientsByType = () =>
//   createSelector(
//     [selectAllIngredients, (_, type: TTabMode) => type],
//     (ingredients, type) => ingredients.filter((item) => item.type === type)
//   );

export const { addIngredient } = burgerConstructorSlice.actions;
export const { selectConstructorItems } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
