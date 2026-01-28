import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'src/services/store';
import { useEffect } from 'react';
import { fetchIngredients } from 'src/services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();

  console.log('APP');

  useEffect(() => {
    dispatch(fetchIngredients());
    console.log('QUERY');
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
      </Routes>
    </div>
  );
};

export default App;
