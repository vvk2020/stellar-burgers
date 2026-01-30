import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

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
    /** Добавление ингредиента в конструктор */
    addItem: (state, action: PayloadAction<TIngredient>) => {
      switch (action.payload.type) {
        case 'bun': {
          state.bun = { ...action.payload, id: uuidv4() };
          break;
        }
        case 'main':
        case 'sauce': {
          state.ingredients = [
            ...state.ingredients,
            { ...action.payload, id: uuidv4() }
          ];
          break;
        }
        default:
          console.error('Неизвестный тип ингредиента');
      }
    },
    /** Удаление ингредиента из конструктора по его id */
    delItem: (state, action: PayloadAction<string>) => {
      const id = action.payload; // uuid ингредиента в конструкторе
      if (!id) {
        console.error('ID ингредиента не указан');
        return;
      }

      const newIngredients = state.ingredients.filter((item) => item.id !== id);

      // Ингредиент не найден в конструкторе
      if (newIngredients.length === state.ingredients.length) {
        console.warn(`Ингредиент с id "${id}" в конструкторе не найден`);
        return;
      }

      // Ингредиент удален из конструктора
      state.ingredients = newIngredients;
    },
    /** Перемещение вверх ингредиента в конструкторе по его id */
    moveUpItem: (state, action: PayloadAction<string>) => {
      const id = action.payload; // uuid ингредиента в конструкторе
      if (!id) {
        console.error('ID ингредиента не указан');
        return;
      }

      // Индекс ингредиента в массиве конструктора
      let currentIndex = state.ingredients.findIndex((item) => item.id === id);
      console.log('currentIndex', currentIndex);

      // Самый верхний элемент переместить еще выше нельзя
      if (currentIndex === -1 || currentIndex === 0) return;

      // Перемещение ингредиента вверх
      const newIngredients = [...state.ingredients];
      const [item] = newIngredients.splice(currentIndex, 1);
      newIngredients.splice(currentIndex - 1, 0, item);
      state.ingredients = newIngredients;
    },
    /** Перемещение вниз ингредиента в конструкторе по его id */
    moveDownItem: (state, action: PayloadAction<string>) => {
      const id = action.payload; // uuid ингредиента в конструкторе
      if (!id) {
        console.error('ID ингредиента не указан');
        return;
      }

      // Индекс ингредиента в массиве конструктора
      let currentIndex = state.ingredients.findIndex((item) => item.id === id);
      console.log('currentIndex', currentIndex);

      // Самый нижний ингредиент переместить еще ниже нельзя
      if (currentIndex === -1 || currentIndex === state.ingredients.length - 1)
        return;

      // Перемещение ингредиента вверх
      const newIngredients = [...state.ingredients];
      const [item] = newIngredients.splice(currentIndex, 1);
      newIngredients.splice(currentIndex + 1, 0, item);
      state.ingredients = newIngredients;
    }
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
    /** Мемоизированный селектор всех ингредиентов конструктора */
    selectConstructorItems: createSelector(
      [
        (state: IBurgerConstructorState) => state.bun,
        (state: IBurgerConstructorState) => state.ingredients
      ],
      (bun, ingredients) => ({
        bun: bun ? { ...bun } : undefined,
        ingredients: [...ingredients]
      })
    ),

    /** Мемоизированный селектор расчетной стоимости ингредиентов конструктора */
    selectItemsTotal: createSelector(
      [
        (state: IBurgerConstructorState) => state.bun,
        (state: IBurgerConstructorState) => state.ingredients
      ],
      (bun, ingredients) =>
        (bun ? bun.price * 2 : 0) +
        ingredients.reduce((sum, item) => sum + item.price, 0)
    )
  }
});

export const { addItem, delItem, moveUpItem, moveDownItem } =
  burgerConstructorSlice.actions;
export const { selectConstructorItems, selectItemsTotal } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
