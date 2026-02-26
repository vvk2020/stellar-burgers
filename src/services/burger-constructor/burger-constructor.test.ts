import { validate, version } from 'uuid';
import {
  IBurgerConstructorState,
  TConstructorIngredient,
  TIngredient
} from '../../utils/types';
import {
  addItem,
  burgerConstructorSlice,
  delItem,
  moveDownItem,
  moveUpItem
} from './slices';

describe('ПРОВЕРКА РЕДЮСЕРА СЛАЙСА КОНСТРУКТОРА БУРГЕРА [burgerConstructorSlice]', () => {
  // Начальное состояние конструктора
  let initialBurgerConstructorState: IBurgerConstructorState;

  // Перед каждым тестом восстанавливаем начальное состояние конструктора
  beforeEach(() => {
    initialBurgerConstructorState = {
      bun: undefined,
      ingredients: [
        {
          id: '643d69a5c3f7b9001cfa0941',
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
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        {
          id: '643d69a5c3f7b9001cfa093e',
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
          image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
        },
        {
          id: '643d69a5c3f7b9001cfa0943',
          _id: '643d69a5c3f7b9001cfa0943',
          name: 'Соус фирменный Space Sauce',
          type: 'sauce',
          proteins: 50,
          fat: 22,
          carbohydrates: 11,
          calories: 14,
          price: 80,
          image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-04-large.png'
        }
      ]
    };
  });

  //* ТЕСТ 1: ДОБАВЛЕНИЯ ИНГРЕДИЕНТА

  test('Тест добавления ингредиента в конструктор', () => {
    // Добавляемый (новый) ингредиент
    const newIngredient: TIngredient = {
      _id: '55555',
      name: 'Тестовый ингредиент',
      type: 'main',
      proteins: 44,
      fat: 13,
      carbohydrates: 17,
      calories: 550,
      price: 515,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    };

    // Добавление ингредиента
    const newState = burgerConstructorSlice.reducer(
      initialBurgerConstructorState,
      addItem(newIngredient)
    );

    const { ingredients } = newState;

    //* 1. Сравннение полученного и ожидаемого массивов ингредиентов (без учета порядка ингредиентов)
    expect(ingredients).toEqual(
      expect.arrayContaining([
        { ...newIngredient, id: expect.any(String) }, // с UUID
        ...initialBurgerConstructorState.ingredients
      ])
    );

    //* 2. Проверка длины массива ингредиентов
    expect(ingredients.length).toEqual(
      initialBurgerConstructorState.ingredients.length + 1
    );

    //* 3. Проверка корректности сгенерированного id по стандарту UUIDv4
    // Массив id ингредиентов до добавления
    const oldIds = initialBurgerConstructorState.ingredients.map((i) => i.id);

    // Получение id добавленного ингредиента
    const addedIngredient = ingredients.find(
      (ingr) => !oldIds.includes(ingr.id)
    );

    // Если addedIngredient не определен, то тест упадет
    expect(addedIngredient).toBeDefined();

    if (addedIngredient) {
      const isValidV4 =
        validate(addedIngredient.id) && version(addedIngredient.id) === 4;
      expect(isValidV4).toBe(true);
    }
  });

  //* ТЕСТ 2: УДАЛЕНИЕ ИНГРЕДИЕНТА

  test('Тест удаления ингредиента из конструктора', () => {
    const deletedIngredientId: string =
      initialBurgerConstructorState.ingredients[0].id;

    const newState = burgerConstructorSlice.reducer(
      initialBurgerConstructorState,
      delItem(deletedIngredientId)
    );

    const { ingredients } = newState;

    // Проверка: удаленный элемент отсутствует?
    expect(
      ingredients.find((i) => i.id === deletedIngredientId)
    ).toBeUndefined();

    // Проверка количества элементов
    expect(ingredients.length).toEqual(
      initialBurgerConstructorState.ingredients.length - 1
    );

    // Проверка пересечения массивов ингредиентов: все оставшиеся ингредиенты присутствуют в новом состоянии?
    expect(ingredients).toEqual(
      expect.arrayContaining(initialBurgerConstructorState.ingredients.slice(1))
    );
  });

  //* ТЕСТ 3: ИЗМЕНЕНИЕ ПОРЯДКА ИНГРЕДИЕНТОВ
  describe('ПРОВЕРКА ИЗМЕНЕНИЯ ПОРЯДКА ИНГРЕДИЕНТОВ В КОНСТРУКТОРЕ БУРГЕРА', () => {
    test('Тест перемещения ингредиента вверх в конструкторе', () => {
      //* Функция перемещения ингредиента вверх
      const ingredientUpMovingTest = (index: number) => {
        // Копия массива ингрдиентов начального состояния
        const initialIngredients = [
          ...initialBurgerConstructorState.ingredients
        ];

        // Перемещаемый ингредиент
        const movedIngredient: TConstructorIngredient = {
          ...initialBurgerConstructorState.ingredients[index]
        };

        const newState = burgerConstructorSlice.reducer(
          initialBurgerConstructorState,
          moveUpItem(movedIngredient.id)
        );

        const { ingredients } = newState;

        if (index > 0 && initialIngredients.length > 1)
          [initialIngredients[index - 1], initialIngredients[index]] = [
            initialIngredients[index],
            initialIngredients[index - 1]
          ];

        // Проверка: массивы идентичны?
        expect(ingredients).toEqual(initialIngredients);
      };

      //* Тест перемещения вверх не самого верхнего ингредиента
      ingredientUpMovingTest(1);
      //* Тест перемещения вверх самого верхнего ингредиента
      ingredientUpMovingTest(0);
    });

    test('Тест перемещения ингредиента вниз в конструкторе', () => {
      //* Функция перемещения ингредиента вниз
      const ingredientDownMovingTest = (index: number) => {
        // Копия массива ингрдиентов начального состояния
        const initialIngredients = [
          ...initialBurgerConstructorState.ingredients
        ];

        // Перемещаемый ингредиент
        const movedIngredient: TConstructorIngredient = {
          ...initialBurgerConstructorState.ingredients[index]
        };

        const newState = burgerConstructorSlice.reducer(
          initialBurgerConstructorState,
          moveDownItem(movedIngredient.id)
        );

        const { ingredients } = newState;

        if (index < initialIngredients.length - 1)
          [initialIngredients[index + 1], initialIngredients[index]] = [
            initialIngredients[index],
            initialIngredients[index + 1]
          ];

        // Проверка: массивы идентичны?
        expect(ingredients).toEqual(initialIngredients);
      };

      //* Тест перемещения вниз не самого нижнего ингредиента
      ingredientDownMovingTest(0);
      //* Тест перемещения вверх самого нижнего ингредиента
      ingredientDownMovingTest(
        initialBurgerConstructorState.ingredients.length - 1
      );
    });
  });
});
