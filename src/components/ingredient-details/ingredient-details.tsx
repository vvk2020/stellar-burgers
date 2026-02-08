import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { selectIngredientById } from '../../services/ingredients/slices';
import { useAppSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<'id'>();

  const ingredientData =
    useAppSelector((state) => selectIngredientById(state)(id)) || null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
