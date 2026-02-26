import { burgerConstructorSlice } from './burger-constructor/slices';
import { feedsSlice } from './feeds/slices';
import { ingredientsSlice } from './ingredients/slices';
import { ordersSlice } from './orders/slices';
import { rootReducer } from './store';
import { userSlice } from './user/slice';

describe('ПРОВЕРКА ПРАВИЛЬНОЙ ИНИЦИАЛИЗАЦИИ [rootReducer]', () => {
  it('Тест наличия слайсов', () => {
    // Начальное состояние rootReducer
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверка наличия всех слайсов
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('orders');
  });

  it('Тест корректности структуры начального состояния', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверка структуры каждого слайса
    expect(initialState.ingredients).toEqual(
      ingredientsSlice.getInitialState()
    );
    expect(initialState.burgerConstructor).toEqual(
      burgerConstructorSlice.getInitialState()
    );
    expect(initialState.user).toEqual(userSlice.getInitialState());
    expect(initialState.feeds).toEqual(feedsSlice.getInitialState());
    expect(initialState.orders).toEqual(ordersSlice.getInitialState());
  });
});
