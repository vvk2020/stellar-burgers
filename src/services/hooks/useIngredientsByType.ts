import { useMemo } from 'react';
import { useSelector } from 'src/services/store';
import { makeSelectIngredientsByType } from 'src/services/slices/ingredientsSlice';
import { TTabMode } from '@utils-types';

/** ХУК-ОБЕРТКА СЕЛЕКТОРА ИНГРЕДИЕНТОВ ПО ИХ ТИПУ */
export const useIngredientsByType = (type: TTabMode) => {
  const selectIngredientsByType = useMemo(
    () => makeSelectIngredientsByType(),
    []
  );
  return useSelector((state) => selectIngredientsByType(state, type));
};
