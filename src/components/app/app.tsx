import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  BurgerIngredient,
  IngredientDetails,
  Modal
} from '@components';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/services/store';
import { useEffect } from 'react';
import { fetchIngredients } from 'src/services/slices/ingredientsSlice';
import { Preloader } from '@ui';

const App = () => {
  const dispatch = useDispatch();

  // Получение всех ингредиентов с сервера
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Флаг: игредиенты загружаются?
  const { loading } = useSelector((state) => state.ingredients);

  //! Маршрутизация

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation; // объект предыдущего маршрута
  //console.log('+++', location, backgroundLocation);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />

        {/* На время загрузки ингредиентов с сервера показываем Preloader */}
        {loading ? (
          <Preloader />
        ) : (
          <>
            {/* Роутинг обычных страниц (всегда рендер ConstructorPage) */}
            <Routes location={backgroundLocation || location}>
              <Route path='/' element={<ConstructorPage />} />
              <Route path='/ingredients/:id' element={<IngredientDetails />} />
            </Routes>

            {/* Роутинг модальных окон (динамические маршруты) */}
            {/* <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal>
                    <IngredientDetails />
                  </Modal>
                }
              />
            </Routes> */}
          </>
        )}
      </div>
    </>
  );
};

export default App;
