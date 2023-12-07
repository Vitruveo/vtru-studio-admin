// import { createAppAsyncThunk } from "@/store/asyncThunk";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAuthReq, userAddReq, userLoginReq, userOTPConfimReq } from './requests';
import {
  UserAddApiRes,
  UserAddReq,
  UserAuthApiRes,
  UserAuthReq,
  UserLoginApiRes,
  UserLoginReq,
  UserOTPConfirmApiRes,
  UserOTPConfirmReq,
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
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const response = await userAddReq({
        name,
        email,
      });
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
