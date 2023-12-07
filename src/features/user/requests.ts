import { apiService } from '@/services/api';
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
  UserOTPConfirmRes,
  UserResDelete,
  UserResUpdate,
  UserUpdateReq,
  UserUpdateRes,
} from './types';

export async function userLoginReq(data: UserLoginReq): Promise<UserLoginApiRes> {
  const res = await apiService.post<string>(`/users/login`, data);
  return res;
}

export function userAuthReq({ email }: UserAuthReq): Promise<UserAuthApiRes> {
  const req: any = {};
  return req;
}

export async function userAddReq(data: UserAddReq): Promise<UserAddApiRes> {
  const response = await apiService.post<UserAddRes>(`/users`, data);
  return response;
}

export async function userUpdateReq(data: UserUpdateReq): Promise<UserApiResUpdate> {
  const response = await apiService.put<UserResUpdate>(`/users/${data._id}`, {
    name: data.name,
    login: { email: data.email },
  });
  return response;
}

export async function userDeleteReq(data: UserDeleteReq): Promise<UserApiResDelete> {
  const response = await apiService.delete<UserResDelete>(`/users/${data._id}`);
  return response;
}

export async function userOTPConfimReq(data: UserOTPConfirmReq): Promise<UserOTPConfirmApiRes> {
  const res = apiService.post<UserOTPConfirmRes>(`/users/login/otpConfirm`, data);
  return res;
}
