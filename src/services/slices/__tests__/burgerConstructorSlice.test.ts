import {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  burgerConstructorReducer
} from '@slices';
import type { TIngredient, TConstructorIngredient } from '@utils-types';
import { getInitialState } from '../burgerConstructor/burgerConstructorSlice';

const initialState = getInitialState();

// Моковые данные с учетом TConstructorIngredient
const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient: TConstructorIngredient = {
  id: '1',
  _id: 'ing1',
  name: 'Котлета',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 2,
  calories: 100,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('burgerConstructorSlice', () => {
  describe('addIngredient', () => {
    it('should add bun correctly', () => {
      const action = addIngredient(mockBun);
      const state = burgerConstructorReducer(undefined, action);

      expect(state.constructorItems.bun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
    });

    it('should add ingredient correctly', () => {
      const action = addIngredient({ ...mockIngredient });
      const state = burgerConstructorReducer(undefined, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual({
        ...mockIngredient,
        id: expect.any(String)
      });
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const testState = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'to-keep' },
            { ...mockIngredient, id: 'to-remove' }
          ]
        }
      };

      const action = removeIngredient({
        id: 'to-remove'
      } as TConstructorIngredient);
      const state = burgerConstructorReducer(testState, action);

      expect(state.constructorItems.ingredients).toEqual([
        { ...mockIngredient, id: 'to-keep' }
      ]);
    });
  });

  describe('ingredient moving', () => {
    const ingredients: TConstructorIngredient[] = [
      { ...mockIngredient, _id: '1', id: 'id1', name: 'Ингредиент 1' },
      { ...mockIngredient, _id: '2', id: 'id2', name: 'Ингредиент 2' },
      { ...mockIngredient, _id: '3', id: 'id3', name: 'Ингредиент 3' }
    ];

    const testState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients
      }
    };

    it('should move ingredient up', () => {
      const state = burgerConstructorReducer(
        testState,
        moveUpIngredient(1) // Двигаем второй элемент (индекс 1)
      );

      expect(state.constructorItems.ingredients.map((i) => i.id)).toEqual([
        'id2',
        'id1',
        'id3'
      ]); // Проверяем по id
    });

    it('should move ingredient down', () => {
      const state = burgerConstructorReducer(
        testState,
        moveDownIngredient(1) // Двигаем второй элемент (индекс 1)
      );

      expect(state.constructorItems.ingredients.map((i) => i.id)).toEqual([
        'id1',
        'id3',
        'id2'
      ]);
    });

    it('should not move first item up', () => {
      const state = burgerConstructorReducer(testState, moveUpIngredient(0));
      expect(state.constructorItems.ingredients).toEqual(ingredients); // Без изменений
    });

    it('should not move last item down', () => {
      const state = burgerConstructorReducer(testState, moveDownIngredient(2));
      expect(state.constructorItems.ingredients).toEqual(ingredients); // Без изменений
    });
  });
});
