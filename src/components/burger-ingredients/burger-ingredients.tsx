import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { useIngredientsByType } from '../../services/hooks/useIngredientsByType';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  const { ingredients, loading } = useSelector((state) => state.ingredients);

  // Ингредиенты по типам
  const buns = useIngredientsByType('bun');
  const mains = useIngredientsByType('main');
  const sauces = useIngredientsByType('sauce');

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

  // if (loading) return <Preloader />;

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
