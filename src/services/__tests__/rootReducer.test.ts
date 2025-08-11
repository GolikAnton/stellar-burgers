import { RootState } from '../store';
import { expect, test } from '@jest/globals';
import store, { rootReducer } from '../store';

describe('rootReducer', () => {
  test('should return the initial state', () => {
    // Получаем initialState, передав пустой экшен
    const initialState: RootState = rootReducer(undefined, { type: 'unknown' });
    const storeState = store.getState();

    expect(initialState).toEqual(storeState);
  });

  test('should handle unknown action type', () => {
    const initialState: RootState = rootReducer(undefined, { type: 'unknown' });
    const newState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние не изменилось
    expect(newState).toEqual(initialState);
    expect(newState).toBe(initialState);
  });
});
