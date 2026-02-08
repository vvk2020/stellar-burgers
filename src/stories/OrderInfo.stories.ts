import type { Meta, StoryObj } from '@storybook/react';
import { OrderInfoUI } from '@ui';
import bunImage from './assets/bun-01-mobile.png';
import meatImage from './assets/meat-02-mobile.png';
import mineralRingsImage from './assets/mineral_rings-mobile.png';
import souceImage from './assets/sauce-02-mobile.png';

const meta = {
  title: 'Example/OrderInfo',
  component: OrderInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OrderInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOrderInfo: Story = {
  args: {
    orderInfo: {
      ingredientsInfo: {
        bun: {
          _id: '111',
          name: 'Булка',
          type: 'top',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: bunImage,
          image_large: bunImage,
          image_mobile: bunImage,
          count: 2
        },
        souce: {
          _id: '211',
          name: 'Соус',
          type: 'bun',
          proteins: 12,
          fat: 23,
          carbohydrates: 45,
          calories: 56,
          price: 67,
          image: souceImage,
          image_large: souceImage,
          image_mobile: souceImage,
          count: 3
        },
        mineralRings: {
          _id: '111',
          name: 'Булка2',
          type: 'top',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: mineralRingsImage,
          image_large: mineralRingsImage,
          image_mobile: mineralRingsImage,
          count: 1
        },
        meatImage: {
          _id: '111',
          name: 'Начинка',
          type: 'top',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: meatImage,
          image_large: meatImage,
          image_mobile: meatImage,
          count: 1
        }
      },
      date: new Date('2024-01-25'),
      total: 134,
      _id: '233',
      status: 'ready',
      name: 'Межзвездный хавчик',
      createdAt: '',
      updatedAt: '',
      number: 13,
      ingredients: ['Булка', 'Начинка']
    },
    isModal: false
  }
};
