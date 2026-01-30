import { AppHeader, IngredientDetails, Modal } from '@components';
import { ConstructorPage } from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import { fetchIngredients } from '../../services/ingredients/actions';
import { selectIngredientsLoadingState } from '../../services/ingredients/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import styles from './app.module.css';

const App = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIngredientsLoadingState); // флаг: ингредиенты загружаются?

  const navigate = useNavigate();
  const location = useLocation();

  // Получение всех ингредиентов с сервера
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const background = location.state?.background; // location предыдущего маршрута

  // Handler возврата на предыдущий маршрут при закрытии Modal
  const onClose = () => navigate(-1);

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
              {/* <Route path='/feed' element={<Feed />} /> */}
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
