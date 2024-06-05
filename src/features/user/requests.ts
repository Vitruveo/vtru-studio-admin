import { apiService } from '@/services/api';
import {
    UserAddApiRes,
    UserAddReq,
    UserAddRes,
    UserApiResDelete,
    UserApiResUpdate,
    UserDeleteReq,
    UserResDelete,
    UserResUpdate,
    UserUpdateReq,
} from './types';

export async function userAddReq(data: UserAddReq): Promise<UserAddApiRes> {
    const response = await apiService.post<UserAddRes>(`/users`, data);
    return response;
}

export async function userUpdateReq(data: UserUpdateReq): Promise<UserApiResUpdate> {
    const response = await apiService.put<UserResUpdate>(`/users/${data._id}`, {
        name: data.name,
        login: { email: data.emails[0].email },
        roles: data.roles,
        framework: data.framework,
    });
    return response;
}

export async function userDeleteReq(data: UserDeleteReq): Promise<UserApiResDelete> {
    const response = await apiService.delete<UserResDelete>(`/users/${data._id}`);
    return response;
}
