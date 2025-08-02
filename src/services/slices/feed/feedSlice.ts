import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getAllFeeds, getOrderByNumber } from './feedActions';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null | undefined;
  orderByNumber: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  orderByNumber: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {}, // Синхронные экшены (если появятся)
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload.orders[0];
      });
  },
  selectors: {
    getAllOrders: (state) => state.orders,
    getTotalOrders: (state) => state.total,
    getTotalOrdersToday: (state) => state.totalToday,
    getOrderByNum: (state) => state.orderByNumber,
    getFeedLoading: (state) => state.loading,
    getFeedErrors: (state) => state.error
  }
});

// Экспорты
export default feedSlice.reducer;
export const {
  getAllOrders,
  getTotalOrders,
  getTotalOrdersToday,
  getOrderByNum,
  getFeedLoading,
  getFeedErrors
} = feedSlice.selectors;
