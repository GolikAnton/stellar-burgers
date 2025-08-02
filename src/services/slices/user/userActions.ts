import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';
import { authChecked } from './userSlice';

export const userGet = createAsyncThunk('user/getApi', getUserApi);

export const userRegister = createAsyncThunk(
  'user/register',
  async ({ email, password, name }: TRegisterData) => {
    const response = await registerUserApi({ email, password, name });

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const userLogIn = createAsyncThunk(
  'user/logIn',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const response = await loginUserApi({ email, password });

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const userLogOut = createAsyncThunk('user/logOut', async () => {
  const response = await logoutApi();

  deleteCookie('accessToken');
  localStorage.clear();

  return response;
});

export const userUpdate = createAsyncThunk('user/update', updateUserApi);

export const checkUser = createAsyncThunk('user/check', (_, { dispatch }) => {
  if (getCookie('accessToken')) {
    dispatch(userGet()).finally(() => {
      dispatch(authChecked());
    });
  } else {
    dispatch(authChecked());
  }
});
