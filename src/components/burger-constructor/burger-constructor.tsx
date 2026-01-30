import { BurgerConstructorUI } from '@ui';
import { FC, useMemo } from 'react';
import { selectConstructorItems } from '../../services/burger-constructor/slices';
import { useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector(selectConstructorItems); // ингредиенты кнструктора

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  // Расчет стоимости бургера
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
