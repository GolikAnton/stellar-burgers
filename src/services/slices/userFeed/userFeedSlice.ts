import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { userFeed } from './userFeedActions';

export type TUserFeedState = {
  orders: TOrder[];
  error: null | string | undefined;
  loading: boolean;
};

const initialState: TUserFeedState = {
  orders: [],
  error: null,
  loading: false
};

export const userFeedSlice = createSlice({
  name: 'userFeed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userFeed.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(userFeed.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки заказов';
        state.loading = false;
      });
  },
  selectors: {
    getUserFeed: (state) => state.orders,
    getUserFeedLoading: (state) => state.loading,
    getUserFeedError: (state) => state.error
  }
});

export default userFeedSlice.reducer;
export const { getUserFeed, getUserFeedLoading, getUserFeedError } =
  userFeedSlice.selectors;
