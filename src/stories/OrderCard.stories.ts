import type { Meta, StoryObj } from '@storybook/react';
import { OrderCardUI } from '@ui';
import bunImage from './assets/bun-01-mobile.png';
import meatImage from './assets/meat-02-mobile.png';
import mineralRingsImage from './assets/mineral_rings-mobile.png';
import souceImage from './assets/sauce-02-mobile.png';

const meta = {
  title: 'Example/OrderCard',
  component: OrderCardUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OrderCardUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOrderCard: Story = {
  args: {
    orderInfo: {
      ingredientsInfo: [
        {
          _id: '111',
          name: 'Булка',
          type: 'top',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: meatImage,
          image_large: meatImage,
          image_mobile: meatImage
        }
      ],
      ingredientsToShow: [
        {
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
          image_mobile: bunImage
        },
        {
          _id: '111',
          name: 'Булка',
          type: 'top',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: mineralRingsImage,
          image_large: mineralRingsImage,
          image_mobile: mineralRingsImage
        },
        {
          _id: '111',
          name: 'Начинка',
          type: 'top',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: souceImage,
          image_large: souceImage,
          image_mobile: souceImage
        },
        {
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
          image_mobile: meatImage
        },
        {
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
          image_mobile: bunImage
        }
      ],
      remains: 2,
      total: 2,
      date: new Date('2024-01-25'),
      _id: '32',
      status: 'ready',
      name: 'Начинка',
      createdAt: '',
      updatedAt: '',
      number: 3,
      ingredients: ['Булка', 'Начинка']
    },
    maxIngredients: 5,
    locationState: {
      background: {
        hash: '',
        key: 'eitkep27',
        pathname: '/',
        search: '',
        state: null
      }
    }
  }
};
