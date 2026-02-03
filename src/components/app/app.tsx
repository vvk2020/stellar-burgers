import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import { fetchFeeds } from '../../services/feeds/actions';
import { fetchIngredients } from '../../services/ingredients/actions';
import { selectIngredientsRequestState } from '../../services/ingredients/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route';
import styles from './app.module.css';

const App = () => {
  const dispatch = useAppDispatch();
  const isProcesing = useAppSelector(selectIngredientsRequestState); // флаг: ингредиенты загружаются?

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchIngredients()); // запрос всех ингредиентов
    dispatch(fetchFeeds()); // запрос заказов в ленту
  }, [dispatch]);

  const background = location.state?.background; // location предыдущего маршрута

  // Handler возврата на предыдущий маршрут при закрытии Modal
  const onClose = () => navigate(-1);

  //! Авторизация
  useEffect(() => {
    // // Регистрация
    // dispatch(
    //   registerUser({
    //     email: `vvk${v4()}@yandex.ru`,
    //     name: 'vvk20188',
    //     password: 'qwertyКУ78+++@'
    //   })
    // );
    // Аутентификация по логину и паролю
    // dispatch(
    //   loginUser({
    //     email: 'vvkb23dae6e-afa2-4f4c-b12a-1c952c1441e4@yandex.ru',
    //     password: 'qwertyКУ78+++@'
    //   })
    // );
    // if (userToken) {
    //   // token есть => запрос пользователя
    //   dispatch(loginUser({ token: userToken }));
    // } else {
    //   // token нет => отправка экшен init()
    //   dispatch(init());
    // }
  }, []);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />

        {/* В процессе загрузки ингредиентов показываем Preloader */}
        {isProcesing ? (
          <Preloader />
        ) : (
          <>
            {/* Роутинг обычных страниц (всегда рендер ConstructorPage) */}
            <Routes location={background || location}>
              <Route path='/' element={<ConstructorPage />} />
              <Route path='/feed' element={<Feed />} />
              <Route path='/ingredients/:id' element={<IngredientDetails />} />
              <Route path='/feed/:number' element={<OrderInfo />} />

              {/* Защищенные маршруты */}
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/login'
                element={
                  <ProtectedRoute>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <ProtectedRoute>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/forgot-password'
                element={
                  <ProtectedRoute>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/reset-password'
                element={
                  <ProtectedRoute>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/profile/orders'
                element={
                  <ProtectedRoute>
                    <ProfileOrders />
                  </ProtectedRoute>
                }
              />

              {/* Неизвестные маршруты */}
              <Route path='*' element={<NotFound404 />} />
            </Routes>

            {/* Роутинг модальных окон (динамические маршруты) */}
            {background && (
              <Routes>
                <Route
                  path='/feed/:number'
                  element={
                    <Modal
                      title={`#${location.pathname.split('/').pop()}`}
                      onClose={onClose}
                    >
                      <OrderInfo />
                    </Modal>
                  }
                />
                <Route
                  path='/ingredients/:id'
                  element={
                    <Modal title='Ингредиент' onClose={onClose}>
                      <IngredientDetails />
                    </Modal>
                  }
                />

                {/* Защищенные маршруты с модальными окнами */}
                <Route
                  path='/profile/orders/:number'
                  element={
                    <ProtectedRoute>
                      <Modal title='Ингредиент' onClose={onClose}>
                        <OrderInfo />
                      </Modal>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
