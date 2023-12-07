import { createSlice } from '@reduxjs/toolkit';

import { userAuthThunk, userAddThunk, userLoginThunk, userOTPConfirmThunk } from './thunks';
import { UserSliceState } from './types';

const initialState: UserSliceState = {
  token: '',
  name: '',
  login: {
    email: '',
  },
  profile: {
    avatar: '',
    phone: '',
    language: '',
    location: '',
  },
  roles: [],
  status: '',
  error: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /** BUILDER USER AUTH THUNK */
    builder.addCase(userLoginThunk.pending, (state, action) => {
      state.status = `loading: ${action.type}`;
    });
    builder.addCase(userLoginThunk.fulfilled, (state, action) => {
      state.status = `succeeded: ${action.type}`;
      state.login.email = action.meta.arg.email;
    });
    builder.addCase(userLoginThunk.rejected, (state, action) => {
      state.status = `failed ${action.type}`;
      state.error = action.error.message || '';
    });

    /** BUILDER USER OTP THUNK */
    builder.addCase(userOTPConfirmThunk.pending, (state, action) => {
      state.status = `loading: ${action.type}`;
    });
    builder.addCase(userOTPConfirmThunk.fulfilled, (state, action) => {
      state.status = `succeeded: ${action.type}`;
      if (!action.payload.data) return;
      state.token = action.payload.data.token;
    });
    builder.addCase(userOTPConfirmThunk.rejected, (state, action) => {
      state.status = `failed: ${action.type}`;
      state.error = action.error.message || '';
    });
  },
});

export const userActionsCreators = userSlice.actions;
