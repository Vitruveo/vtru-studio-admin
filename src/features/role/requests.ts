import { apiService } from '@/services/api';
import {
    GetRolesPaginatedParams,
    GetRolesPaginatedResponse,
    RoleApiResCreate,
    RoleApiResDelete,
    RoleApiResUpdate,
    RoleReqCreate,
    RoleReqUpdate,
    RoleResCreate,
    RoleResDelete,
    RoleResUpdate,
} from './types';
import axios from 'axios';
import { APIResponse } from '../common/types';
import { BASE_URL_API } from '@/constants/api';
import store from '@/store';

export async function getRolesPaginated(params: GetRolesPaginatedParams) {
    return axios.get<APIResponse<GetRolesPaginatedResponse>>(`${BASE_URL_API}/roles`, {
        headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
        },
        params,
    });
}

export async function createRole(data: RoleReqCreate): Promise<RoleApiResCreate> {
    const response = await apiService.post<RoleResCreate>('/roles', data);

    return response;
}

export async function updateRole(data: RoleReqUpdate): Promise<RoleApiResUpdate> {
    const response = await apiService.put<RoleResUpdate>(`/roles/${data._id}`, data);

    return response;
}

export async function deleteRole(id: string): Promise<RoleApiResDelete> {
    const response = await apiService.delete<RoleResDelete>(`/roles/${id}`);

    return response;
}
