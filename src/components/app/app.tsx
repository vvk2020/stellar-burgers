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
import { selectIngredientsLoadingState } from '../../services/ingredients/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { loginUser } from '../../services/user/actions';
import styles from './app.module.css';

const App = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIngredientsLoadingState); // флаг: ингредиенты загружаются?

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
    dispatch(
      loginUser({
        email: 'vvkb23dae6e-afa2-4f4c-b12a-1c952c1441e4@yandex.ru',
        password: 'qwertyКУ78+++@'
      })
    );

    // if (userToken) {
    //   // token есть => запрос пользователя
    //   dispatch(loginUser({ token: userToken }));
    // } else {
    //   // token нет => отправка экшен init()
    //   dispatch(init());
    // }
  }, []);

  console.log('location.state', location.state, location.pathname);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />

        {/* В процессе загрузки ингредиентов показываем Preloader */}
        {loading ? (
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
              {/* <ProtectedRoute> */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ResetPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/profile/orders' element={<ProfileOrders />} />
              {/* </ProtectedRoute> */}
              {/* Неизвестные маршруты */}
              <Route path='*' element={<NotFound404 />} />
            </Routes>

            {/* Роутинг модальных окон (динамические маршруты) */}
            {background && (
              <Routes>
                <Route
                  path='/ingredients/:id'
                  element={
                    <Modal title='Ингредиент' onClose={onClose}>
                      <IngredientDetails />
                    </Modal>
                  }
                />
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

                {/* <Route path='/feed/:number' element={<ModalOrderInfo />} /> */}
              </Routes>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
