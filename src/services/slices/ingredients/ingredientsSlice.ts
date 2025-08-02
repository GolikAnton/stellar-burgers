import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredients } from './ingredientsActions';

export type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: null | string | undefined;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {}, // Синхронные экшены (если появятся — вынесем в actions.ts)
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    getSelectedIngredients: (state) => state.ingredients,
    getLoadingStatus: (state) => state.loading
  }
});

// Экспортируем редьюсер по умолчанию и селекторы
export default ingredientsSlice.reducer;
export const { getSelectedIngredients, getLoadingStatus } =
  ingredientsSlice.selectors;
