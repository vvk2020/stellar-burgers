import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IBurgerConstructorState,
  TConstructorIngredient,
  TIngredient
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

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
    addItem: {
      // Генерация id для уникальности ингредиента (перед выполнением reducer)
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return {
          payload: { ...ingredient, id }
        };
      },

      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const { type, id, ...ingredientData } = action.payload;
        switch (type) {
          case 'bun': {
            // state.bun = { ...action.payload, id: uuidv4() };
            state.bun = { ...ingredientData, type: 'bun' as const, id };
            break;
          }
          case 'main':
          case 'sauce': {
            // В RTK push() можно, т.к. Immer создает новое иммутабельное state
            //  на основе изменений в draft (черновике)
            state.ingredients.push({ ...ingredientData, type, id });
            break;
          }
          default:
            console.error('Неизвестный тип ингредиента');
        }
      }
    },
    /** Удаление ингредиента из конструктора по его id */
    delItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
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
      const id = action.payload;
      if (!id) {
        console.error('ID ингредиента не указан');
        return;
      }

      // Индекс ингредиента в массиве конструктора
      let currentIndex = state.ingredients.findIndex((item) => item.id === id);

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
      const id = action.payload;
      if (!id) {
        console.error('ID ингредиента не указан');
        return;
      }

      // Индекс ингредиента в массиве конструктора
      let currentIndex = state.ingredients.findIndex((item) => item.id === id);

      // Самый нижний ингредиент переместить еще ниже нельзя
      if (currentIndex === -1 || currentIndex === state.ingredients.length - 1)
        return;

      // Перемещение ингредиента вниз
      const newIngredients = [...state.ingredients];
      const [item] = newIngredients.splice(currentIndex, 1);
      newIngredients.splice(currentIndex + 1, 0, item);
      state.ingredients = newIngredients;
    },
    /** Очистка конструктора */
    clearConstructor: (state) => {
      state.bun = undefined;
      state.ingredients = [];
    }
  },
  selectors: {
    /** Ингредиенты конструктора */
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

    /** Расчетная стоимость ингредиентов конструктора */
    selectItemsTotal: createSelector(
      [
        (state: IBurgerConstructorState) => state.bun,
        (state: IBurgerConstructorState) => state.ingredients
      ],
      (bun, ingredients) =>
        (bun ? bun.price * 2 : 0) +
        ingredients.reduce((sum, item) => sum + item.price, 0)
    ),

    /** Количество ингредиента в конструкторе по его _id */
    selectItemCount: (state: IBurgerConstructorState) => {
      const countMap = new Map<string, number>();

      // Ингредиенты
      state.ingredients.forEach((item) => {
        countMap.set(item._id, (countMap.get(item._id) || 0) + 1);
      });

      // Булка
      if (state.bun) countMap.set(state.bun._id, 2);

      return (_id: string) => countMap.get(_id) || 0;
    },

    /** Массив id булки и ингредиентов конструктора */
    selectIngredientsIds: createSelector(
      [
        (state: IBurgerConstructorState) => state.bun,
        (state: IBurgerConstructorState) => state.ingredients
      ],
      (bun, ingredients) => {
        const ids: string[] = [];
        if (bun) ids.push(bun._id);
        if (Array.isArray(ingredients)) {
          ingredients.forEach((item) => ids.push(item._id));
        }
        if (bun) ids.push(bun._id);
        return ids;
      }
    )
  }
});

export const { addItem, delItem, moveUpItem, moveDownItem, clearConstructor } =
  burgerConstructorSlice.actions;
export const {
  selectConstructorItems,
  selectItemsTotal,
  selectItemCount,
  selectIngredientsIds
} = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
