import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useDispatch, useSelector } from 'src/services/store';
import { fetchIngredients } from 'src/services/slices/ingredientsSlice';
import { useIngredientsByType } from 'src/services/hooks/useIngredientsByType';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  // const dispatch = useDispatch();

  const { ingredients, loading } = useSelector((state) => state.ingredients);

  // useEffect(() => {
  //   console.log('777');

  //   dispatch(fetchIngredients());
  // }, [dispatch]);

  // console.log(loading, ingredients);

  // Ингредиенты по типам
  const buns = useIngredientsByType('bun');
  const mains = useIngredientsByType('main');
  const sauces = useIngredientsByType('sauce');

  // Фильтрация ингредиентов по типам
  // const { buns, mains, sauces } = useMemo(() => {
  //   const buns = ingredients.filter((item: TIngredient) => item.type === 'bun');
  //   const mains = ingredients.filter(
  //     (item: TIngredient) => item.type === 'main'
  //   );
  //   const sauces = ingredients.filter(
  //     (item: TIngredient) => item.type === 'sauce'
  //   );

  // const buns = useSelector(selectIngredientsByType('bun'));
  // const mains = useSelector(selectIngredientsByType('main'));
  // const sauces = useSelector(selectIngredientsByType('sauce'));

  //   return { buns, mains, sauces };
  // }, [ingredients]);

  /** TODO: взять переменные из стора */
  // const buns = [];
  // const mains = [];
  // const sauces = [];

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Важем порядок проверки ингредиентов при активации вкладки
  // (исправление ошибки скачка на соусы при клике по начинкам)
  useEffect(() => {
    // сначала проверка булок
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewFilling) {
      // затем начинки
      setCurrentTab('main');
    } else if (inViewSauces) {
      // и лишь потом соусы
      setCurrentTab('sauce');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  if (loading) return <Preloader />;

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // return null;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
