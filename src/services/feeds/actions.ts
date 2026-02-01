import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';

/** ASYNC ACTION ПОЛУЧЕНИЯ ЛЕНТЫ ЗАКАЗОВ (БЕЗ АВТОРИЗАЦИИ) */
export const fetchFeeds = createAsyncThunk('ingredients/fetchFeeds', async () =>
  getFeedsApi()
);
