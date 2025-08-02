import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

// Асинхронный экшен для загрузки ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);
