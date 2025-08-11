import { getAllFeeds, getOrderByNumber, feedSlice, TFeedState } from '@slices';
import { getInitialState } from '../feed/feedSlice';

const initialState = getInitialState();

const mockFeedResponse = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: ['ing1', 'ing2'],
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      number: 1
    },
    {
      _id: '2',
      ingredients: ['ing3', 'ing4'],
      status: 'pending',
      name: 'Бургер 2',
      createdAt: '2023-01-02',
      updatedAt: '2023-01-02',
      number: 2
    }
  ],
  total: 100,
  totalToday: 10
};

const mockOrderResponse = {
  success: true,
  orders: [mockFeedResponse.orders[0]] // Первый заказ для теста по номеру
};

describe('feedSlice тесты', () => {
  describe('getAllFeeds экшен', () => {
    it('pending: сбрасывает ошибку и устанавливает loading', () => {
      const state = feedSlice.reducer(
        { ...initialState, error: 'Ошибка' } as TFeedState,
        getAllFeeds.pending('')
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('fulfilled: сохраняет данные заказов', () => {
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        getAllFeeds.fulfilled(mockFeedResponse, '')
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        orders: mockFeedResponse.orders,
        total: mockFeedResponse.total,
        totalToday: mockFeedResponse.totalToday
      });
    });

    it('rejected: сохраняет ошибку', () => {
      const error = new Error('Ошибка загрузки');
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        getAllFeeds.rejected(error, '')
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Ошибка загрузки'
      });
    });
  });

  describe('getOrderByNumber экшен', () => {
    it('pending: сбрасывает ошибку и устанавливает loading', () => {
      const state = feedSlice.reducer(
        { ...initialState, error: 'Ошибка' },
        getOrderByNumber.pending('', 1)
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('fulfilled: сохраняет заказ по номеру', () => {
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        getOrderByNumber.fulfilled(mockOrderResponse, '', 1)
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        orderByNumber: mockOrderResponse.orders[0]
      });
    });

    it('rejected: сохраняет ошибку', () => {
      const error = new Error('Заказ не найден');
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        getOrderByNumber.rejected(error, '', 1)
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Заказ не найден'
      });
    });
  });

  describe('Селекторы', () => {
    const testState = {
      feed: {
        ...initialState,
        orders: mockFeedResponse.orders,
        total: mockFeedResponse.total,
        totalToday: mockFeedResponse.totalToday,
        orderByNumber: mockOrderResponse.orders[0]
      }
    };

    it('getAllOrders: возвращает все заказы', () => {
      expect(feedSlice.selectors.getAllOrders(testState)).toEqual(
        mockFeedResponse.orders
      );
    });

    it('getOrderByNum: возвращает заказ по номеру', () => {
      expect(feedSlice.selectors.getOrderByNum(testState)).toEqual(
        mockOrderResponse.orders[0]
      );
    });

    it('getFeedLoading: возвращает статус загрузки', () => {
      expect(
        feedSlice.selectors.getFeedLoading({
          feed: { ...initialState, loading: true }
        })
      ).toBe(true);
    });
  });
});
