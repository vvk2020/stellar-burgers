import { IBurgerConstructorState, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: IBurgerConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
