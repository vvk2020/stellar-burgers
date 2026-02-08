import type { Meta, StoryObj } from '@storybook/react';
import { BurgerConstructorUI } from '@ui';
import React from 'react';

console.log(React.version);

const meta = {
  title: 'Example/BurgerConstructor',
  component: BurgerConstructorUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BurgerConstructorUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultConstructor: Story = {
  args: {
    constructorItems: { bun: undefined, ingredients: [] },
    orderRequest: false,
    price: 0,
    orderModalData: null,
    onOrderClick: () => {},
    closeOrderModal: () => {}
  }
};
