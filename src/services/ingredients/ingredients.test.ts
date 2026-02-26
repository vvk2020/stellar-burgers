import { configureStore } from '@reduxjs/toolkit';
import { TIngredient, TIngredientsResponse } from '../../utils/types';
import { fetchIngredients } from './actions';
import { ingredientsSlice } from './slices';

describe('ПРОВЕРКА ASYNC-РЕДЮСЕРА СЛАЙСА ЛЕНТЫ ИНГРЕДИЕНТОВ [ingredientsSlice]', () => {
  // Начальное state ленты ингредиентов
  let requestedData: TIngredient[] = [];
  let originalFetch: typeof fetch;

  // Перед каждым тестом
  beforeEach(() => {
    // Восстанавление массива запрашиваемых ингредиентов
    requestedData = [
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
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
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
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        __v: 0
      }
    ];

    // Сохранение оригинального fetch
    originalFetch = global.fetch;
  });

  // После каждого теста
  afterEach(() => {
    // Восстанавление оригинального fetch
    global.fetch = originalFetch;
  });

  test('Контроль статуса запроса ингредиентов', async () => {
    // Контролируемый Promise с правильным типом
    let resolvePromise: (value: TIngredientsResponse) => void;
    const promise = new Promise<TIngredientsResponse>((resolve) => {
      resolvePromise = resolve;
    });

    // Подмена fetch()
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => promise
      } as Response)
    ) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsSlice.reducer }
    });

    // Проверка isRequested ДО запуска fetchIngredients()
    let state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);

    // Запуск async fetchIngredients()
    const dispatchPromise = store.dispatch(fetchIngredients());

    // Проверка isRequested ДО завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(true);

    // Завершение запроса с возвратом ожидаемых данных
    resolvePromise!({
      success: true,
      data: requestedData
    });

    // Ожидание завершения fetchIngredients()
    await dispatchPromise;

    // Проверка isRequested ПОСЛЕ завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);

    // Проверка вызова fetch
    expect(global.fetch).toHaveBeenCalled();
  });

  test('Тест обработки успешного запроса ленты ингредиентов', async () => {
    // Контролируемый Promise с правильным типом
    let resolvePromise: (value: TIngredientsResponse) => void;
    const promise = new Promise<TIngredientsResponse>((resolve) => {
      resolvePromise = resolve;
    });

    // Подмена fetch()
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => promise
      } as Response)
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

    // Завершение запроса с возвратом ожидаемых данных
    resolvePromise!({
      success: true,
      data: requestedData
    });

    // Ожидание завершения fetchIngredients()
    await dispatchPromise;

    // Проверка isRequested ПОСЛЕ завершения fetchIngredients()
    state = store.getState();
    expect(state.ingredients.isRequested).toBe(false);
    expect(state.ingredients.data).toEqual(requestedData);
    expect(state.ingredients.error).toBeNull();

    // Проверка вызова fetch
    expect(global.fetch).toHaveBeenCalled();
  });

  describe('ТЕСТЫ ОБРАБОТКИ ОШИБОК ЗАПРОСОВ ЛЕНТЫ ИНГРЕДИЕНТОВ', () => {
    test('Тест обработки ошибки сети', async () => {
      // Заглушка console.error для этого теста
      const originalConsoleError = console.error;
      console.error = jest.fn();

      try {
        const errorMessage = 'Network error';

        // Подмена на fetch() с отклоненным промисом
        global.fetch = jest
          .fn()
          .mockImplementationOnce(() =>
            Promise.reject(new Error(errorMessage))
          ) as jest.Mock;

        const store = configureStore({
          reducer: { ingredients: ingredientsSlice.reducer }
        });

        // ДО запуска fetchIngredients()
        let state = store.getState();
        expect(state.ingredients.isRequested).toBe(false);
        expect(state.ingredients.data).toEqual([]);
        expect(state.ingredients.error).toBeNull();

        // Запуск async fetchIngredients()
        const dispatchPromise = store.dispatch(fetchIngredients());

        // ДО завершения fetchIngredients()
        state = store.getState();
        expect(state.ingredients.isRequested).toBe(true);
        expect(state.ingredients.data).toEqual([]);
        expect(state.ingredients.error).toBeNull();

        // Ожидание завершения fetchIngredients()
        await dispatchPromise;

        // ПОСЛЕ завершения fetchIngredients()
        state = store.getState();
        expect(state.ingredients.isRequested).toBe(false);
        expect(state.ingredients.data).toEqual([]);

        // Проверка: корреткно ли сообщение об ошибке
        expect(state.ingredients.error).toBe(errorMessage);

        // Проверка вызова fetch
        expect(global.fetch).toHaveBeenCalled();

        // Проверка: console.error был вызван с правильным сообщением?
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      } finally {
        // Восстанавление console.error (даже при падении теста)
        console.error = originalConsoleError;
      }
    });

    test('Тест обработки ошибки сервера', async () => {
      // Заглушка console.error только для этого теста
      const originalConsoleError = console.error;
      console.error = jest.fn();

      try {
        const serverErrorMessage = 'Сервер временно недоступен';

        // Подмена на fetch() с ответом об ошибке и reject в checkResponse
        global.fetch = jest.fn().mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            json: () =>
              Promise.resolve({
                success: false,
                message: serverErrorMessage
              })
          } as Response)
        ) as jest.Mock;

        const store = configureStore({
          reducer: { ingredients: ingredientsSlice.reducer }
        });

        // Запуск async fetchIngredients()
        const dispatchPromise = store.dispatch(fetchIngredients());
        await dispatchPromise;

        // Проверка состояния после ошибки
        const state = store.getState();
        expect(state.ingredients.isRequested).toBe(false);
        expect(state.ingredients.data).toEqual([]);

        // Проверка: ошибка не null (ошибка с данными ответа сервера)
        expect(state.ingredients.error).not.toBeNull();
        // Проверка: сообщение об ошибке содержит часть сообщения сервера
        expect(state.ingredients.error).toContain(serverErrorMessage);
        // Проверка: console.error был вызван
        expect(console.error).toHaveBeenCalled();
      } finally {
        // Восстанавление console.error
        console.error = originalConsoleError;
      }
    });
  });
});
