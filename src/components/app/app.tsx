import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';

const App = () => {
  const dispatch = useDispatch();

  // Получение всех ингредиентов с сервера
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Флаг: ингредиенты загружаются?
  const { loading } = useSelector((state) => state.ingredients);

  //! Маршрутизация

  const location = useLocation();
  const background = location.state?.background; // объект предыдущего маршрута

  //! Callback для onClose в Modal
  const navigate = useNavigate(); // Добавляем useNavigate
  const onClose = () => {
    navigate(-1);
  };

  console.log('location', location);
  console.log('background', background);

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
            <Routes location={background || location}>
              <Route path='/' element={<ConstructorPage />} />
              <Route path='/ingredients/:id' element={<IngredientDetails />} />
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
              </Routes>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
