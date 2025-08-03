import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';

// Загрузка всех заказов
export const getAllFeeds = createAsyncThunk('feed/getAll', getFeedsApi);

// Получение заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'order/byNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);
