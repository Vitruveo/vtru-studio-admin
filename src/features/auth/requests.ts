import { apiService } from '@/services/api';
import { UserLoginApiRes, UserLoginReq, UserOTPConfirmApiRes, UserOTPConfirmReq, UserOTPConfirmRes } from './types';

export async function userLoginReq(data: UserLoginReq): Promise<UserLoginApiRes> {
    const res = await apiService.post<string>(`/users/login`, data);
    return res;
}

export async function userOTPConfimReq(data: UserOTPConfirmReq): Promise<UserOTPConfirmApiRes> {
    const res = apiService.post<UserOTPConfirmRes>(`/users/login/otpConfirm`, data);
    return res;
}
