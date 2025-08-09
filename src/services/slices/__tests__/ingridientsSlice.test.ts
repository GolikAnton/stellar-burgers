import { getIngredients, ingredientsSlice, TIngredientsState } from '@slices';
import type { TIngredient } from '@utils-types';

// Моковые данные
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png'
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 2,
    calories: 100,
    price: 50,
    image: 'image2.png',
    image_mobile: 'image2-mobile.png',
    image_large: 'image2-large.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(ingredientsSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should set loading to "true" on getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should set ingredients on getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      ingredients: mockIngredients,
      loading: false,
      error: null
    });
  });

  it('should set error on getIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  // Тесты для селекторов
  describe('selectors', () => {
    const state = {
      ingredients: {
        ingredients: mockIngredients,
        loading: false,
        error: null
      }
    };

    it('should select all ingredients', () => {
      expect(ingredientsSlice.selectors.getSelectedIngredients(state)).toEqual(
        mockIngredients
      );
    });

    it('should select loading status', () => {
      expect(ingredientsSlice.selectors.getLoadingStatus(state)).toBe(false);
    });
  });
});
