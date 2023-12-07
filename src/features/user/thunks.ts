// import { createAppAsyncThunk } from "@/store/asyncThunk";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAuthReq, userAddReq, userLoginReq, userOTPConfimReq, userUpdateReq, userDeleteReq } from './requests';
import {
  UserAddApiRes,
  UserAddReq,
  UserAddRes,
  UserApiResDelete,
  UserApiResUpdate,
  UserAuthApiRes,
  UserAuthReq,
  UserDeleteReq,
  UserLoginApiRes,
  UserLoginReq,
  UserOTPConfirmApiRes,
  UserOTPConfirmReq,
  UserUpdateReq,
  UserUpdateRes,
} from './types';

export const userLoginThunk = createAsyncThunk<UserLoginApiRes, UserLoginReq>(
  'user/login',
  async ({ email }, { rejectWithValue, getState }) => {
    try {
      const response = await userLoginReq({ email });
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  },
);

export const userAuthThunk = createAsyncThunk<UserAuthApiRes, UserAuthReq>(
  'user/auth',
  async ({ email }, { rejectWithValue, getState }) => {
    try {
      const response = await userAuthReq({ email });
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  },
);

export const userAddThunk = createAsyncThunk<UserAddApiRes, UserAddReq>(
  'user/add',
  async ({ name, login: { email } }, { rejectWithValue }) => {
    try {
      const response = await userAddReq({
        name,
        login: { email },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  },
);

export const userUpdateThunk = createAsyncThunk<UserApiResUpdate, UserUpdateReq>(
  'user/update',
  async ({ _id, name, email, roles }, { rejectWithValue }) => {
    try {
      const response = await userUpdateReq({ _id, name, email, roles });
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  },
);

export const userOTPConfirmThunk = createAsyncThunk<UserOTPConfirmApiRes, UserOTPConfirmReq>(
  'user/otpConfirm',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await userOTPConfimReq({
        email,
        code,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  },
);

export const userDeleteThunk = createAsyncThunk<UserApiResDelete | undefined, UserDeleteReq>(
  'user/delete',
  async ({ _id }, { rejectWithValue, getState }) => {
    try {
      const response = await userDeleteReq({ _id });
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  },
);
