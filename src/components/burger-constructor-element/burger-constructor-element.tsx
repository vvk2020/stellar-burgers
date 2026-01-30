import { BurgerConstructorElementUI } from '@ui';
import { FC, memo } from 'react';
import {
  delItem,
  moveDownItem,
  moveUpItem
} from '../../services/burger-constructor/slices';
import { useAppDispatch } from '../../services/store';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    /** Handler сдвига вниз ингредиента в конструкторе */
    const handleMoveDown = () => {
      dispatch(moveDownItem(ingredient.id));
    };

    /** Handler сдвига вверх ингредиента в конструкторе */
    const handleMoveUp = () => {
      dispatch(moveUpItem(ingredient.id));
    };

    /** Handler удаления ингредиента из конструктора */
    const handleClose = () => {
      dispatch(delItem(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
