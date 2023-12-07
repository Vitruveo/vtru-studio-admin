import { apiService } from '@/services/api';
import {
  UserAddApiRes,
  UserAddReq,
  UserAddRes,
  UserAuthApiRes,
  UserAuthReq,
  UserLoginApiRes,
  UserLoginReq,
  UserOTPConfirmApiRes,
  UserOTPConfirmReq,
  UserOTPConfirmRes,
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
  const response = await apiService.put<UserAddRes>(`/users`, data);
  return response;
}

export async function userOTPConfimReq(data: UserOTPConfirmReq): Promise<UserOTPConfirmApiRes> {
  const res = apiService.post<UserOTPConfirmRes>(`/users/login/otpConfirm`, data);
  return res;
}
