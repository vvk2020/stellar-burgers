import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

/** ASYNC ACTION ПОЛУЧЕНИЯ ВСЕХ ИНГРЕДИЕНТОВ С СЕРВЕРА */
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi()
);
