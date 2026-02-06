import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
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
import { fetchIngredients } from '../../services/ingredients/actions';
import { selectIngredientsRequestState } from '../../services/ingredients/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route';
import styles from './app.module.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isIngredientsRequested = useAppSelector(selectIngredientsRequestState); // ингредиенты загружаются?

  useEffect(() => {
    dispatch(fetchIngredients()); // запрос всех ингредиентов
  }, []);

  const background = location.state?.background; // location предыдущего маршрута

  // Handler возврата на предыдущий маршрут при закрытии Modal
  const onClose = () => navigate(-1);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />

        {/* В процессе загрузки ингредиентов показываем Preloader */}
        {isIngredientsRequested ? (
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
                path='/login'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/forgot-password'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ForgotPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/reset-password'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <Profile />
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
                      <Modal
                        title={`#${location.pathname.split('/').pop()}`}
                        onClose={onClose}
                      >
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
