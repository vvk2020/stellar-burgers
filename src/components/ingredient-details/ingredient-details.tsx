import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredientById } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<'id'>();

  console.log('id', id);

  // if (id) {
  const ingredientData =
    useSelector((state) => selectIngredientById(state)(id)) || null;
  console.log('ingredientData', ingredientData);
  // }

  /** TODO: взять переменную из стора */
  // const ingredientData = null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
