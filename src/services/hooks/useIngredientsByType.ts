import { useMemo } from 'react';
import { makeSelectIngredientsByType } from '../ingredients/slices';
import { TTabMode } from '@utils-types';
import { useAppSelector } from '../store';

/** ХУК-ОБЕРТКА СЕЛЕКТОРА ИНГРЕДИЕНТОВ ПО ИХ ТИПУ */
export const useIngredientsByType = (type: TTabMode) => {
  const selectIngredientsByType = useMemo(
    () => makeSelectIngredientsByType(),
    []
  );
  return useAppSelector((state) => selectIngredientsByType(state, type));
};
