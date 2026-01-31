import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import {
  addItem,
  selectItemCount
} from '../../services/burger-constructor/slices';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    count = useAppSelector((state) => selectItemCount(state)(ingredient._id));

    const handleAdd = () => {
      // Добавление ингредиента в store
      dispatch(addItem(ingredient));
      console.log('count', count);
    };

    // count =
    // console.log('abc', abc);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
