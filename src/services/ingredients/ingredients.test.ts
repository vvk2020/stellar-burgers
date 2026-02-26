// src\services\ingredients\ingredients.test.ts
import { configureStore } from '@reduxjs/toolkit';
import { fetchIngredients } from './actions';
import { ingredientsSlice } from './slices';

describe('ПРОВЕРКА ASYNC-РЕДЮСЕРА СЛАЙСА ЛЕНТЫ ИНГРЕДИЕНТОВ [ingredientsSlice]', () => {
  // Начальное state ленты ингредиентов
  const expectedResult = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      __v: 0
    }
  ];

  test('Контроль статуса запроса ингредиентов', async () => {
    // Контролируемый Promise
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Подмена fetch() с контролируемым промисом
    // (формат ответа getIngredientsApi() - { success: true, data: TIngredient[] })
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => promise
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsSlice.reducer }
    });

    // Проверка isRequested ДО запуска fetchIngredients()
    let state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);
    expect(state.ingredients.data).toEqual([]);
    expect(state.ingredients.error).toBeNull();

    // Запуск async fetchIngredients()
    const dispatchPromise = store.dispatch(fetchIngredients());

    // Проверка isRequested ДО завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(true);
    expect(state.ingredients.data).toEqual([]);
    expect(state.ingredients.error).toBeNull();

    // Завершение запроса с возвратом ожидаемых данных в правильном формате
    resolvePromise!({
      success: true,
      data: expectedResult
    });

    // Ожидание завершения fetchIngredients()
    await dispatchPromise;

    // Проверяем isRequested ПОСЛЕ завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);
    expect(state.ingredients.data).toEqual(expectedResult);
    expect(state.ingredients.error).toBeNull();
  });

  test('Тест сохранения в store ингредиентов, полученных из запроса', async () => {
    // Контролируемый Promise
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Подмена fetch() с контролируемым промисом
    // (формат ответа getIngredientsApi() - { success: true, data: TIngredient[] })
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => promise
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsSlice.reducer }
    });

    // Проверка isRequested ДО запуска fetchIngredients()
    let state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);
    expect(state.ingredients.data).toEqual([]);
    expect(state.ingredients.error).toBeNull();

    // Запуск async fetchIngredients()
    const dispatchPromise = store.dispatch(fetchIngredients());

    // Проверка isRequested ДО завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(true);
    expect(state.ingredients.data).toEqual([]);
    expect(state.ingredients.error).toBeNull();

    // Завершение запроса с возвратом ожидаемых данных в правильном формате
    resolvePromise!({
      success: true,
      data: expectedResult
    });

    // Ожидание завершения fetchIngredients()
    await dispatchPromise;

    // Проверяем isRequested ПОСЛЕ завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);
    expect(state.ingredients.data).toEqual(expectedResult);
    expect(state.ingredients.error).toBeNull();
  });
});
