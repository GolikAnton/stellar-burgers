import { userFeed, userFeedSlice, type TUserFeedState } from '@slices';
import type { TOrder } from '@utils-types';

// Моковые данные
const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Заказ 1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1
  },
  {
    _id: '2',
    ingredients: ['ing3', 'ing4'],
    status: 'pending',
    name: 'Заказ 2',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02',
    number: 2
  }
];

const initialState: TUserFeedState = {
  orders: [],
  error: null,
  loading: false
};

describe('userFeedSlice тесты', () => {
  describe('initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(userFeedSlice.reducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('userFeed экшен', () => {
    it('pending: устанавливает loading и сбрасывает ошибку', () => {
      const state = userFeedSlice.reducer(
        { ...initialState, error: 'Предыдущая ошибка' },
        userFeed.pending('')
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('fulfilled: сохраняет заказы и сбрасывает loading', () => {
      const state = userFeedSlice.reducer(
        { ...initialState, loading: true },
        userFeed.fulfilled(mockOrders, '')
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        orders: mockOrders
      });
    });

    it('rejected: сохраняет ошибку и сбрасывает loading', () => {
      const error = new Error('Ошибка сервера');
      const state = userFeedSlice.reducer(
        { ...initialState, loading: true },
        userFeed.rejected(error, '')
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Ошибка сервера'
      });
    });

    it('rejected: использует стандартное сообщение при отсутствии ошибки', () => {
      const state = userFeedSlice.reducer(
        { ...initialState, loading: true },
        { type: userFeed.rejected.type, error: { message: undefined } }
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Ошибка загрузки заказов' 
      });
    });
  });

  describe('Селекторы', () => {
    const testState = {
      userFeed: {
        ...initialState,
        orders: mockOrders,
        loading: true,
        error: 'Тестовая ошибка'
      }
    };

    it('getUserFeed: возвращает список заказов', () => {
      expect(userFeedSlice.selectors.getUserFeed(testState)).toEqual(
        mockOrders
      );
    });

    it('getUserFeedLoading: возвращает статус загрузки', () => {
      expect(userFeedSlice.selectors.getUserFeedLoading(testState)).toBe(true);
    });

    it('getUserFeedError: возвращает ошибку', () => {
      expect(userFeedSlice.selectors.getUserFeedError(testState)).toBe(
        'Тестовая ошибка'
      );
    });
  });
});
