import { userAddReq, userLoginReq, userOTPConfimReq, userUpdateReq, userDeleteReq } from './requests';
import {
  UserAddApiRes,
  UserAddReq,
  UserApiResDelete,
  UserApiResUpdate,
  UserDeleteReq,
  UserLoginApiRes,
  UserLoginReq,
  UserOTPConfirmApiRes,
  UserOTPConfirmReq,
  UserUpdateReq,
} from './types';
import { ReduxThunkAction } from '@/store';
import { userActionsCreators } from './slice';

export function userLoginThunk(payload: UserLoginReq): ReduxThunkAction<Promise<UserLoginApiRes>> {
  return async function (dispatch, getState) {
    const response = await userLoginReq({ email: payload.email });

    dispatch(userActionsCreators.login({ email: payload.email }));

    return response;
  };
}

export function userAddThunk(payload: UserAddReq): ReduxThunkAction<Promise<UserAddApiRes>> {
  return async function (dispatch, getState) {
    const response = await userAddReq({ name: payload.name, login: { email: payload.login.email } });
    return response;
  };
}

export function userUpdateThunk(payload: UserUpdateReq): ReduxThunkAction<Promise<UserApiResUpdate>> {
  return async function (dispatch, getState) {
    const response = await userUpdateReq({
      _id: payload._id,
      name: payload.name,
      profile: payload.profile,
      roles: payload.roles,
      framework: payload.framework,
    });
    return response;
  };
}

export function userOTPConfirmThunk(payload: UserOTPConfirmReq): ReduxThunkAction<Promise<UserOTPConfirmApiRes>> {
  return async function (dispatch, getState) {
    const response = await userOTPConfimReq({ email: payload.email, code: payload.code });
    dispatch(userActionsCreators.otpConfirm(response));

    return response;
  };
}

export function userDeleteThunk(payload: UserDeleteReq): ReduxThunkAction<Promise<UserApiResDelete | undefined>> {
  return async function (dispatch, getState) {
    const response = await userDeleteReq({ _id: payload._id });
    return response;
  };
}
