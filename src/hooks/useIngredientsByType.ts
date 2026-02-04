import { TTabMode } from '@utils-types';
import { useMemo } from 'react';
import { makeSelectIngredientsByType } from '../services/ingredients/slices';
import { useAppSelector } from '../services/store';

/** ХУК-ОБЕРТКА СЕЛЕКТОРА ИНГРЕДИЕНТОВ ПО ИХ ТИПУ */
export const useIngredientsByType = (type: TTabMode) => {
  const selectIngredientsByType = useMemo(
    () => makeSelectIngredientsByType(),
    []
  );
  return useAppSelector((state) => selectIngredientsByType(state, type));
};
