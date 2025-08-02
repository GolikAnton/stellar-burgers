import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';

// Асинхронный экшен для загрузки заказов пользователя
export const userFeed = createAsyncThunk('userFeed/fetchAll', getOrdersApi);
